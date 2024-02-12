import { useState } from "react";
import { NoticeType } from "../interface/interface";

type PopupProps = {
  setShowPopup: (val: boolean) => void;
  setGetNotice: (val: any) => void;
};

export const Popup = ({ setShowPopup, setGetNotice }: PopupProps) => {
  const [title, setTitle] = useState<string>("");
  const [noteColor, setNoteColor] = useState<string>("white");

  const writeNotice = () => {
    if (title !== "") {
      setGetNotice((prev: NoticeType[]) =>
        prev.map((item: NoticeType) => ({
          ...item,
          note: [
            ...item.note,
            {
              title,
              order: Math.floor(1000000 + Math.random() * 9000000),
              color: noteColor,
            },
          ],
        }))
      );
      setShowPopup(false);
    }
  };

  return (
    <div
      style={{
        width: 400,
        height: 200,
        border: "1px solid black",
        backgroundColor: "DodgerBlue",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <div style={{ padding: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: "white" }}>
          Notice
        </span>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 10,
          }}
        >
          <label style={{ color: "white" }}>Title</label>
          <input
            placeholder="write title"
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: 350, height: 30 }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            backgroundColor: "red",
            width: 20,
            height: 20,
            borderRadius: "100%",
            cursor: "pointer",
          }}
          onClick={() => setNoteColor("red")}
        ></div>
        <div
          style={{
            backgroundColor: "Khaki",
            width: 20,
            height: 20,
            marginLeft: 10,
            borderRadius: "100%",
            cursor: "pointer",
          }}
          onClick={() => setNoteColor("Khaki")}
        ></div>
        <div
          style={{
            backgroundColor: "Lime",
            width: 20,
            height: 20,
            marginLeft: 10,
            borderRadius: "100%",
            cursor: "pointer",
          }}
          onClick={() => setNoteColor("Lime")}
        ></div>
        <div
          style={{
            backgroundColor: "yellow",
            width: 20,
            height: 20,
            marginLeft: 10,
            borderRadius: "100%",
            cursor: "pointer",
          }}
          onClick={() => setNoteColor("yellow")}
        ></div>
      </div>

      <div style={{ width: "100%", position: "absolute", bottom: 10 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingInline: 5,
          }}
        >
          <div>
            <button
              style={{
                borderStyle: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: "white",
              }}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
          <div>
            <button
              style={{
                borderStyle: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: "white",
              }}
              onClick={() => writeNotice()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
