import "../styles/dashboard.css";

function MyFilesView({ fileList, handleOpenFile }) {
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
            <div
              className="file-row"
              key={file.id}
              onClick={() => handleOpenFile(file)}
            >
              <div className="file-name">
                <span className="file-icon">
                  📄
                </span>

                <span>{file.name}</span>
              </div>

              <span>{file.size}</span>

              <span>{file.modified}</span>

              <div></div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyFilesView;