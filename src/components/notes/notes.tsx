import { useEffect, useState } from "react";
import editImg from "../../assets/edit.png";
import { NoteType, NoticeType } from "../interface/interface";

type NotesProps = {
  setShowNotes: (val: boolean) => void;
  notice: NoticeType[];
  currentNotice: NoticeType;
  setNotice: (val: any) => void;
};

export const Notes = ({
  setShowNotes,
  notice,
  currentNotice,
  setNotice,
}: NotesProps) => {
  const [grappedNote, setGrappedNote] = useState<NoteType | null>(null);
  const [noticeList, setNoticeList] = useState<NoticeType[]>([]);
  const [changeTitle, setChangeTitle] = useState<string>("");
  const [orderNote, setOrderNote] = useState<number>();
  const [noteColor, setNoteColor] = useState<string>("white");

  useEffect(() => {
    const filteredNotice = notice.filter(
      (item: NoticeType) => item.id === currentNotice.id
    );

    setNoticeList(filteredNotice);
  }, [notice, currentNotice]);

  const dragStartHandler = (data: NoteType) => {
    setGrappedNote(data);
    console.log("noteBefore", data);
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, data: NoteType) => {
    e.preventDefault();

    const updatedNoticeList = noticeList.map((item: NoticeType) => {
      if (
        item.note.find((note: NoteType) => note.order === data.order) ||
        item.note.find(
          (note: NoteType) => grappedNote && note.order === grappedNote.order
        )
      ) {
        const updatedNotes = item.note.map((note: NoteType) => {
          if (note.order === data.order) {
            return { ...grappedNote };
          } else if (grappedNote && note.order === grappedNote.order) {
            return { ...data };
          }
          return note;
        });
        return { ...item, note: updatedNotes };
      }
      return item;
    });

    setNoticeList(updatedNoticeList);
    setChangeTitle("");
  };

  const sortNote = (a: NoteType, b: NoteType) => {
    if (a.order === undefined) {
      return b.order === undefined ? 0 : -1;
    } else if (b.order === undefined) {
      return 1;
    }

    return a.order - b.order;
  };

  const changeTask = () => {
    const updatedNoticeList = noticeList.map((item: NoticeType) => {
      if (item.note.find((note: NoteType) => note.order === orderNote)) {
        const updatedNotes = item.note.map((note: NoteType) => {
          if (note.order === orderNote) {
            return { ...note, title: changeTitle, color: noteColor };
          }
          return note;
        });

        return { ...item, note: updatedNotes };
      }

      return item;
    });
    setNoticeList(updatedNoticeList);
    changedNote(updatedNoticeList);
  };

  const changedNote = (updatedNoticeList: NoticeType[]) => {
    const updated = notice.map((item: NoticeType) => {
      const foundUpdatedItem = updatedNoticeList.find(
        (updatedItem: NoticeType) => updatedItem.noteId === item.noteId
      );

      if (foundUpdatedItem) {
        return foundUpdatedItem;
      }

      return item;
    });

    setNotice(updated);
    localStorage.setItem("notice", JSON.stringify(updated));
  };

  return (
    <div
      style={{
        width: 400,
        height: 400,
        border: "1px solid black",
        backgroundColor: "DodgerBlue",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      {noticeList.length > 0 &&
        noticeList.map((item: NoticeType) =>
          item.note.sort(sortNote).map((data: NoteType) => (
            <div style={{ paddingTop: 5, paddingBottom: 5 }}>
              <div
                onDragStart={(e) => dragStartHandler(data)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, data)}
                draggable={true}
                style={{
                  width: 350,
                  height: 60,
                  border: "1px solid black",
                  cursor: "grab",
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: "LightSkyBlue",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <input
                      value={
                        orderNote === data.order ? changeTitle : data.title
                      }
                      onClick={() => setOrderNote(data.order)}
                      onChange={(e) => setChangeTitle(e.target.value)}
                      style={{ width: "300px", height: 20 }}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => changeTask()}
                      style={{
                        borderStyle: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <img src={editImg} alt="" style={{ width: 20 }} />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingTop: 5,
                  }}
                >
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
              </div>
            </div>
          ))
        )}

      <div
        style={{
          position: "absolute",
          bottom: "10px",
        }}
      >
        <button
          onClick={() => setShowNotes(false)}
          style={{
            borderStyle: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            color: "white",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
