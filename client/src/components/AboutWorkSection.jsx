import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const AboutWorkSection = ({ editorState, setEditorState }) => {
  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        About Work
      </h2>
      <div className="mt-4">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="border border-[#DDDDDD] rounded-lg overflow-hidden"
          editorClassName="px-4"
          toolbarClassName="border-0 border-b border-[#DDDDDD] bg-[#FDE6E6]"
          toolbar={{
            options: [
              "inline",
              "blockType",
              "list",
              "textAlign",
              "link",
              "history"
            ],
            inline: { options: ["bold", "italic", "underline"] },
            blockType: {
              options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"]
            },
            list: { options: ["unordered", "ordered"] }
          }}
          editorStyle={{
            height: "20rem",
            overflow: "auto",
            padding: "16px",
            backgroundColor: "white",
            fontFamily: "inherit"
          }}
          toolbarStyle={{ padding: "8px", marginBottom: 0 }}
        />
        <p className="mt-2 text-xs text-gray-500">
          Use the toolbar above to format your text. Add details about the job
          responsibilities, project scope, and expected outcomes.
        </p>
      </div>
    </section>
  );
};

export default AboutWorkSection;
