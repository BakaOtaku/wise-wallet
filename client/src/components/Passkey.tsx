import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  platformAuthenticatorIsAvailable,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
// @ts-ignore
import elliptic from "elliptic";
import base64url from "base64url";
import { v4 as uuidv4 } from "uuid";
import { AsnParser } from "@peculiar/asn1-schema";
import { ECDSASigValue } from "@peculiar/asn1-ecc";
import { utils } from "@passwordless-id/webauthn";
import * as cbor from "./utils/cbor";
import { parseAuthData, shouldRemoveLeadingZero } from "./utils/helpers";
import { ethers, BigNumber } from "ethers";
import { useSigningClient } from "@/context/cosmwasm";
const EC = elliptic.ec;
const ec = new EC("p256");

export enum COSEKEYS {
  kty = 1,
  alg = 3,
  crv = -1,
  x = -2,
  y = -3,
  n = -1,
  e = -2,
}

const PasskeyLogic: React.FC = () => {
  const classes = useStyles();
  const { walletAddress } = useSigningClient();
  const [credentials, setCredentials] = useState<any>(null);
  const [publicKeys, setPublicKeys] = useState([] as any[]);
  const [signature, setSignature] = useState("");

  const createPassKey = async () => {
    const supportsWebAuthn = browserSupportsWebAuthn();
    const supportsWebAuthnAutofill = await browserSupportsWebAuthnAutofill();
    const platformAuthenticatorAvailable =
      await platformAuthenticatorIsAvailable();

    console.log(
      `Browser supports WebAuthn: ${supportsWebAuthn}
Browser supports WebAuthn Autofill: ${supportsWebAuthnAutofill}
Platform Authenticator available: ${platformAuthenticatorAvailable}`
    );

    const platform = platformAuthenticatorAvailable
      ? "platform"
      : "cross-platform";

    const username = "test";
    const challenge = uuidv4();
    // const challenge = "";
    const obj = {
      rp: {
        name: window.location.hostname,
        id: window.location.hostname,
      },
      user: {
        id: username,
        name: username,
        displayName: username,
      },
      challenge: challenge,
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      attestation: "direct",
      // timeout: 60000,
      authenticatorSelection: {
        userVerification: "required", // Webauthn default is "preferred"
        authenticatorAttachment: platform,
      },
    };
    console.log("registration options", obj);
    const publicKeyCredential = await startRegistration(obj as any);
    console.log(publicKeyCredential);

    const attestationObject = base64url.toBuffer(
      publicKeyCredential.response.attestationObject
    );
    const authData = cbor.decode(attestationObject.buffer, undefined, undefined)
      .authData as Uint8Array;

    let authDataParsed = parseAuthData(authData);

    let pubk = cbor.decode(
      authDataParsed.COSEPublicKey.buffer,
      undefined,
      undefined
    );

    const x = pubk[COSEKEYS.x];
    const y = pubk[COSEKEYS.y];

    const pk = ec.keyFromPublic({ x, y });

    const publicKey = [
      "0x" + pk.getPublic("hex").slice(2, 66),
      "0x" + pk.getPublic("hex").slice(-64),
    ];
    console.log({ publicKey });
    setCredentials(publicKeyCredential);
    setPublicKeys(publicKey);
  };

  const getMessageSignature = (authResponseSignature: string): BigNumber[] => {
    // See https://github.dev/MasterKale/SimpleWebAuthn/blob/master/packages/server/src/helpers/iso/isoCrypto/verifyEC2.ts
    // for extraction of the r and s bytes from the raw signature buffer
    const parsedSignature = AsnParser.parse(
      base64url.toBuffer(authResponseSignature),
      ECDSASigValue
    );
    let rBytes = new Uint8Array(parsedSignature.r);
    let sBytes = new Uint8Array(parsedSignature.s);
    if (shouldRemoveLeadingZero(rBytes)) {
      rBytes = rBytes.slice(1);
    }
    if (shouldRemoveLeadingZero(sBytes)) {
      sBytes = sBytes.slice(1);
    }
    // r and s values
    return [BigNumber.from(rBytes), BigNumber.from(sBytes)];
  };

  const signUserOperationHash = async (userOpHash: string) => {
    const challenge = utils
      .toBase64url(ethers.utils.arrayify(userOpHash))
      .replace(/=/g, "");
    console.log(challenge);
    const authData = await startAuthentication({
      rpId: window.location.hostname,
      challenge: challenge,
      userVerification: "required",
      // authenticatorType: "both",
      allowCredentials: [
        {
          type: "public-key",
          id: credentials.rawId,
        },
      ],
      // timeout: 60000,
    });
    const sign = getMessageSignature(authData.response.signature);
    console.log({ challenge, sign, authData });
    const clientDataJSON = new TextDecoder().decode(
      utils.parseBase64url(authData.response.clientDataJSON)
    );
    const challengePos = clientDataJSON.indexOf(challenge);
    const challengePrefix = clientDataJSON.substring(0, challengePos);
    const challengeSuffix = clientDataJSON.substring(
      challengePos + challenge.length
    );
    const authenticatorData = new Uint8Array(
      utils.parseBase64url(authData.response.authenticatorData)
    );
    const sig = {
      id: BigNumber.from(
        ethers.utils.keccak256(new TextEncoder().encode(credentials.id))
      ),
      r: sign[0],
      s: sign[1],
      authData: authenticatorData,
      clientDataPrefix: challengePrefix,
      clientDataSuffix: challengeSuffix,
    };
    console.log({ sig });
    let encodedSig = ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "uint256", "uint256", "bytes", "string", "string"],
      [
        sig.id,
        sig.r,
        sig.s,
        sig.authData,
        sig.clientDataPrefix,
        sig.clientDataSuffix,
      ]
    );
    console.log({ encodedSig });
    return encodedSig;
  };

  const signUserOperation = async () => {
    // const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const userOp = {
      sender: "0x676D806cC5C4E4261B4A98e028a854570dB0e332",
      nonce: "0x00",
      initCode: "0x",
      callData:
        "0x9e5d4c490000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
      paymasterAndData: "0x",
      maxFeePerGas: 1113906838,
      maxPriorityFeePerGas: 1000000000,
      callGasLimit: 39580,
      verificationGasLimit: 150000,
      preVerificationGas: 21000,
      signature: "0x",
    };
    const userOpHash =
      "0x3333743a4f69665d5ab813a71cef6b187fa980a371ed088b102f0e7a389c954e";
    console.log({ userOpHash });
    const signature = await signUserOperationHash(userOpHash);
    console.log({ userOpHash, signature });
    setSignature(signature);
    return signature;
  };

  return (
    <>
      <button
        onClick={createPassKey}
        className={classes.btn}
        style={{
          margin: "auto",
          marginTop: "2%",
        }}
      >
        🔐 Create passkey pair →
      </button>
      <button
        onClick={signUserOperation}
        className={classes.btn}
        style={{
          margin: "auto",
          marginTop: "2%",
        }}
      >
        🔑 Sign userOp with passkey →
      </button>

      <div
        style={{
          margin: "0 auto",
          marginTop: 30,
          maxWidth: 750,
          wordBreak: "break-all",
          backgroundColor: "rgb(7, 39, 35, 0.2)",
          padding: "20px",
        }}
      >
        <h4>Public key EOA (secp256k1): </h4>
        <li>
          <span style={{ color: "green" }}>{walletAddress}</span>
        </li>
      </div>

      {publicKeys.length > 0 && (
        <div
          style={{
            margin: "0 auto",
            marginTop: 30,
            maxWidth: 750,
            wordBreak: "break-all",
            backgroundColor: "rgb(7, 39, 35, 0.2)",
            padding: "20px",
          }}
        >
          <h4>Public key pair generated (secp256r1): </h4>
          <li>
            <span style={{ color: "green" }}> {publicKeys[0]}</span>{" "}
          </li>
          <li>
            {" "}
            <span style={{ color: "green" }}>{publicKeys[1]}</span>
          </li>
        </div>
      )}

      {signature && (
        <p
          style={{
            margin: "0 auto",
            marginTop: 30,
            maxWidth: 750,
            wordBreak: "break-all",
            backgroundColor: "rgb(7, 39, 35, 0.2)",
            padding: "20px",
          }}
        >
          UserOpSignature: <span style={{ color: "green" }}>{signature}</span>
        </p>
      )}
    </>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    // display: "flex",
  },
  btn: {
    margin: "20px 0 20px 40%",
    background: "rgb(40,43,76, 0.9)",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: 5,
    height: "36px",
    fontSize: 18,
    lineHeight: "36px",
    padding: "0 18px 0 18px",
    borderBottom: "1px solid #000",
    display: "flex",
    alignItems: "center",
    color: "white",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "rgb(40,43,76, 0.8)",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
}));

export default PasskeyLogic;
