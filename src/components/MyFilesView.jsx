import FileRow from "./FileRow";
import "../styles/dashboard.css";

function MyFilesView({
  fileList,
  openMenu,
  menuDirection,
  handleMenuClick,
  handleOpenFile,
  handleFileRenameClick,
  handleFileDeleteClick,
  favoriteFiles,
  handleToggleFavorite
}) {
  return (
    <div className="my-files-view">

      <div className="my-files-header">
        <div>
          <h1>My Files</h1>
          <p>All your files in one place.</p>
        </div>
      </div>

      {fileList.length === 0 ? (
        <div className="folder-empty-state">
          <div className="folder-empty-icon">
            📁
          </div>

          <h2>No files yet</h2>

          <p>
            Upload a file to get started.
          </p>
        </div>
      ) : (
        <div className="files-table">

          <div className="file-row file-header">
            <span>Name</span>
            <span>Size</span>
            <span>Modified</span>
            <span></span>
          </div>

          {fileList.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              menuId={`my-files-${file.id}`}
              openMenu={openMenu}
              menuDirection={menuDirection}
              handleMenuClick={handleMenuClick}
              handleOpenFile={handleOpenFile}
              handleFileRenameClick={handleFileRenameClick}
              handleFileDeleteClick={handleFileDeleteClick}
              favoriteFiles={favoriteFiles}
              handleToggleFavorite={handleToggleFavorite}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default MyFilesView;