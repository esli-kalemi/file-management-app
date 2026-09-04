import "../styles/folder-card.css";
import "../styles/dashboard.css";

function FolderCard({
  folder,
  openMenu,
  menuDirection,
  handleMenuClick,
  handleOpenFolder,
  handleRenameClick,
  handleDeleteClick,
  favoriteFolders,
  handleToggleFolderFavorite
}) {
  return (
    <div
      className="folder-card"
      onClick={() => handleOpenFolder(folder)}
    >
      <div className="folder-icon">
        📁
      </div>

      <div>
        <h3>{folder.name}</h3>
        <p>{folder.fileCount} files</p>
        </div>

        <button
        className={`folder-favorite-button ${
            favoriteFolders.some(
            (favorite) => favorite.id === folder.id
            )
            ? "folder-favorite-active"
            : ""
        }`}
        onClick={(event) => {
            event.stopPropagation();
            handleToggleFolderFavorite(folder);
        }}
        >
        ★
        </button>

      <div className="card-menu-container">
        <button
          className="card-menu"
          onClick={(event) => {
            event.stopPropagation();

            handleMenuClick(
              event,
              `folder-${folder.id}`
            );
          }}
        >
          ⋮
        </button>

        {openMenu === `folder-${folder.id}` && (
          <div
            className={`context-menu ${menuDirection}`}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              onClick={() =>
                handleOpenFolder(folder)
              }
            >
              Open
            </button>

            <button
              onClick={() =>
                handleRenameClick(folder)
              }
            >
              Rename
            </button>

            <button
              onClick={() =>
                handleDeleteClick(folder)
              }
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderCard;