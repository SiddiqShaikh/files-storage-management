import ActionDropDown from "@/components/ActionDropDown";
import FormattedDatetime from "@/components/FormattedDatetime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import {
  getFiles,
  getTotalUsedSpace,
} from "@/lib/appwrite/actions/file.action";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

const Home = async () => {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalUsedSpace(),
  ]);
  const usageSummary = getUsageSummary(totalSpace);
  return (
    <div className="dashboard-container">
      <section>
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDatetime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="flex flex-col gap-5 mt-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                key={file.$id}
                className="flex items-center gap-3"
                target="_blank"
              >
                <Thumbnail
                  extension={file.extension}
                  type={file.type}
                  url={file.url}
                />
                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDatetime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropDown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No Files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Home;
