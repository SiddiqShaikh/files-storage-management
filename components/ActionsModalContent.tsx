import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDatetime from "./FormattedDatetime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail extension={file.extension} type={file.type} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDatetime className="caption" date={file.$createdAt} />
    </div>
  </div>
);

const DetailsRow = ({ label, value }: { value: string; label: string }) => (
  <div className="flex ">
    <div className="file-details-label">{label}</div>
    <div className="file-details-value">{value}</div>
  </div>
);
export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <DetailsRow label={"Format:"} value={file.extension} />
      <DetailsRow label={"Size:"} value={convertFileSize(file.size)} />
      <DetailsRow label={"Owner:"} value={file.owner.fullName} />
      <DetailsRow
        label={"Last edit:"}
        value={formatDateTime(file.$updatedAt)}
      />
    </>
  );
};

interface Props {
  onRemove: (email: string) => void;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  file: Models.Document;
}
export const ShareInput = ({ onRemove, onInputChange, file }: Props) => (
  <>
    {" "}
    <ImageThumbnail file={file} />
    <div className="share-wrapper">
      <p className="subtitle-2 text-light-100">Shared with other users</p>
      <Input
        onChange={(e) => onInputChange(e.target.value.trim().split(","))}
        className="share-input-field"
        type="email"
        placeholder="Enter user email"
      />
      <div className="pt-4">
        <div className="flex justify-between">
          <p className="subtitle-2 text-light-100">Shared with</p>
          <p className="caption text-light-200">{file.users.length} users</p>
        </div>
      </div>
      <ul className="pt-2">
        {file.users.map((email: string) => (
          <li key={email} className="flex items-center justify-between gap-2">
            <p className="subtitle-2">{email}</p>
            <Button
              onClick={() => onRemove(email)}
              className="share-remove-user"
            >
              <Image src="/assets/icons/remove.svg" height={24} width={24} alt="remove" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  </>
);
