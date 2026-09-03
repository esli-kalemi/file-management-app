import "../styles/dashboard.css";

function FileRow({
  file,
  menuId,
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
    <div
      className="file-row"
      onClick={() => handleOpenFile(file)}
    >
      <div className="file-name">
        <span className="file-icon">📄</span>
        <span>{file.name}</span>

        <button
            className={`favorite-button ${
            favoriteFiles.some(
                (favorite) => favorite.id === file.id
            )
                ? "favorite-active"
                : ""
            }`}
            onClick={(event) => {
            event.stopPropagation();
            handleToggleFavorite(file);
            }}
        >
            ★
        </button>
        </div>

      <span>{file.size}</span>

      <span>{file.modified}</span>

      <div className="card-menu-container">
        <button
          className="card-menu"
          onClick={(event) => {
            event.stopPropagation();
            handleMenuClick(event, menuId);
          }}
        >
          ⋮
        </button>

        {openMenu === menuId && (
          <div
            className={`context-menu ${menuDirection}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button onClick={() => handleOpenFile(file)}>
              Open
            </button>

            <button>
              Download
            </button>

            <button
              onClick={() => handleFileRenameClick(file)}
            >
              Rename
            </button>

            <button
              onClick={() => handleFileDeleteClick(file)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileRow;