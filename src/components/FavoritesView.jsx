import FileRow from "./FileRow";
import FolderCard from "./FolderCard";
import "../styles/dashboard.css";

function FavoritesView({
  favoriteFiles,
  favoriteFolders,
  openMenu,
  menuDirection,
  handleMenuClick,
  handleOpenFile,
  handleFileRenameClick,
  handleFileDeleteClick,
  handleToggleFavorite,
  handleOpenFolder,
  handleRenameClick,
  handleDeleteClick,
  handleToggleFolderFavorite
}) {
  return (
    <div className="favorites-view">

      <div className="favorites-view-header">
        <div>
          <h1>Favorites</h1>
          <p>Your favorite files and folders.</p>
        </div>
      </div>
        {favoriteFolders.length > 0 && (
        <div className="section">
            <div className="section-header">
            <h2>Favorite Folders</h2>
            </div>

    <div className="folders-grid">
        {favoriteFolders.map((folder) => (
            <FolderCard
            key={folder.id}
            folder={folder}
            openMenu={openMenu}
            menuDirection={menuDirection}
            handleMenuClick={handleMenuClick}
            handleOpenFolder={handleOpenFolder}
            handleRenameClick={handleRenameClick}
            handleDeleteClick={handleDeleteClick}
            favoriteFolders={favoriteFolders}
            handleToggleFolderFavorite={handleToggleFolderFavorite}
            />
        ))}
        </div>
    </div>
    )}
      {favoriteFiles.length === 0 && favoriteFolders.length === 0 ? (
        <div className="folder-empty-state">
          <div className="folder-empty-icon">
            ★
          </div>

          <h2>No favorites yet</h2>

          <p>
            Files and folders you mark as favorites
            will appear here.
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

          {favoriteFiles.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              menuId={`favorite-file-${file.id}`}
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

export default FavoritesView;