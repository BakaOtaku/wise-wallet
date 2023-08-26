import React from "react";
import { Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

type IModalProps = {
  liquidity?: number;
  avaToAlgo?: boolean;
  algoToAva?: boolean;
  triggerModal: boolean;
  setTriggerModal: (value: boolean) => void;
  data: {
    url: string;
    address?: string;
    addressOne?: string;
    addressTwo?: string;
  };
};

const ResultModal = ({
  liquidity,
  avaToAlgo,
  algoToAva,
  triggerModal,
  setTriggerModal,
  data,
}: IModalProps) => {
  const classes = useStyles();

  const closeModal = () => {
    setTriggerModal(false);
  };

  return (
    <Modal
      open={triggerModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={"classes.modalContainer"}
    >
      <div className={"classes.modal"}>
        <div className={"classes.closeModal"} onClick={closeModal}>
          <Close style={{ fontSize: "16px" }} />
        </div>
        <div className={"classes.graphicSection"}>
          <div className="iconContainer">
            <img src="/background/thumbs-up.png" alt="thumb icon" />
            {/* <HexagonGraphic color="#1DBA2D" /> */}
          </div>
        </div>
        <div className={"classes.textSection"}>
          {liquidity && (
            <p>
              Transaction hash → : <span>{data.address}</span>
            </p>
          )}

          {/* for FormATE.jsx */}
          {algoToAva && (
            <p>
              Transaction → :{" "}
              <span>
                <a
                  href={`${data.url}${data.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.address}
                </a>
              </span>
            </p>
          )}

          {avaToAlgo && (
            <>
              <p>
                Tx1 → Approve:{" "}
                <span>
                  <a
                    href={`${data.url}${data.addressOne}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.addressOne}
                  </a>
                </span>
              </p>
              <p>
                Tx2 → Bridge:{" "}
                <span>
                  {" "}
                  <a
                    href={`${data.url}${data.addressTwo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.addressTwo}
                  </a>
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  // ...theme.overrides.modalStyle,
  purple: {
    color: "#7533E2",
  },
}));

export default ResultModal;
