import "../styles/dashboard.css";

function TrashView({
  trashFiles,
  trashFolders,
  folderList,
  handleRestoreFile,
  handleRestoreFolder,
  handlePermanentDelete,
  handlePermanentDeleteFolder,
  handleEmptyTrash
}) {
      return (
    <div className="trash-view">

        <div className="trash-view-header">
            <div>
                <h1>Trash</h1>
                <p>Files and folders you have deleted are stored here.</p>            </div>

            {(trashFiles.length > 0 || trashFolders.length > 0) && (
                <button
                className="btn btn-danger"
                onClick={handleEmptyTrash}
                >
                Empty Trash
                </button>
            )}
         </div>
      {trashFiles.length === 0 && trashFolders.length === 0 ? (
        <div className="folder-empty-state">
          <div className="folder-empty-icon">
            🗑️
          </div>

          <h2>Trash is empty</h2>

          <p>
            Deleted files will appear here.
          </p>
        </div>
      ) : (
        <div className="files-table">

  <div className="file-row file-header">
    <span>Name</span>
    <span>Type</span>
    <span>Original Location</span>
    <span>Deleted</span>
    <span></span>
  </div>

  {trashFiles.map((file) => (
    <div
      className="file-row"
      key={`file-${file.id}`}
    >
      <div className="file-name">
        <span className="file-icon">
          📄
        </span>

        <span>{file.name}</span>
      </div>

      <span>File</span>

      <span>
        {folderList.find(
          (folder) => folder.id === file.folderId
        )?.name || "No folder"}
      </span>

      <span>{file.deletedAt}</span>

      <div className="trash-actions">
        <button
          onClick={() => handleRestoreFile(file)}
        >
          Restore
        </button>

        <button
          className="permanent-delete-btn"
          onClick={() => handlePermanentDelete(file)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}

  {trashFolders.map((folder) => (
    <div
      className="file-row"
      key={`folder-${folder.id}`}
    >
      <div className="file-name">
        <span className="file-icon">
          📁
        </span>

        <span>{folder.name}</span>
      </div>

      <span>Folder</span>

      <span>My Files</span>

      <span>{folder.deletedAt}</span>

      <div className="trash-actions">
        <button
          onClick={() => handleRestoreFolder(folder)}
        >
          Restore
        </button>

        <button
          className="permanent-delete-btn"
          onClick={() => handlePermanentDeleteFolder(folder)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}

</div>
      )}

    </div>
  );
}

export default TrashView;