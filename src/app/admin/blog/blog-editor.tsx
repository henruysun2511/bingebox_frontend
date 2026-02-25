"use client";

import { useUploadFile } from "@/hooks/useUploadFile";
import dynamic from "next/dynamic";

const Editor = dynamic(
    () => import("@tinymce/tinymce-react").then(mod => mod.Editor),
    { ssr: false }
);

interface Props {
    value: string;
    onChange: (val: string) => void;
}

export function BlogEditor({ value, onChange }: Props) {
    const { uploadFile } = useUploadFile();

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
            value={value}
            onEditorChange={onChange}
            init={{
                ui_mode: "split",
                dialog_container: document.body,
                height: 500,
                menubar: false,
                plugins: "image link code lists table help",
                toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image | code",

                automatic_uploads: true,
                file_picker_types: "image",

                images_upload_handler: (blobInfo) =>
                    new Promise(async (resolve, reject) => {
                        try {
                            const file = blobInfo.blob();
                            const uploaded = await uploadFile(file as File);
                            resolve(uploaded.url);
                        } catch (error) {
                            reject(error);
                        }
                    }),

                file_picker_callback: (callback, value, meta) => {
                    if (meta.filetype === "image") {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";

                        input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;

                            const uploaded = await uploadFile(file);
                            callback(uploaded.url);
                        };

                        input.click();
                    };

                },
            }}
        />
    );
}