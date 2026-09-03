import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { folders, files } from "../data/mockData";
import FileRow from "./FileRow";
import FolderCard from "./FolderCard";
import TrashView from "./TrashView";
import MyFilesView from "./MyFilesView";
import FavoritesView from "./FavoritesView";

function Dashboard({ currentSection }) {

    const [openMenu, setOpenMenu] = useState(null);
    const [menuDirection, setMenuDirection] = useState("down");
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [folderList, setFolderList] = useState(folders);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [folderToRename, setFolderToRename] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [fileList, setFileList] = useState(files);

    const [fileToRename, setFileToRename] = useState(null);
    const [showFileRenameModal, setShowFileRenameModal] = useState(false);

    const [fileToDelete, setFileToDelete] = useState(null);
    const [showFileDeleteModal, setShowFileDeleteModal] = useState(false);

    const [uploadFolder, setUploadFolder] = useState(null);
    const [trashFiles, setTrashFiles] = useState([]);
    const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
    const [fileToPermanentlyDelete, setFileToPermanentlyDelete] = useState(null);
    const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
    const [favoriteFiles, setFavoriteFiles] = useState([]);
    const [favoriteFolders, setFavoriteFolders] = useState([]);

    useEffect(() => {
    function handleClickOutside() {
        setOpenMenu(null);
    }

    if (openMenu !== null) {
        document.addEventListener("click", handleClickOutside);
    }

    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
    }, [openMenu]);

    function handleMenuClick(event, menuId) {
        event.stopPropagation();

        const buttonRect = event.currentTarget.getBoundingClientRect();

        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        const menuHeight = 200;

        if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
            setMenuDirection("up");
        } else {
            setMenuDirection("down");
        }

        setOpenMenu(
            openMenu === menuId ? null : menuId
        );
    }

    function handleCreateFolder() {
        if (!folderName.trim()) {
            return;
        }

        const newFolder = {
            id: Date.now(),
            name: folderName.trim(),
            fileCount: 0
        };

        setFolderList((currentFolders) => [
            ...currentFolders,
            newFolder
        ]);

        setFolderName("");
        setShowFolderModal(false);
    }

    function handleRenameClick(folder) {
        setFolderToRename(folder);
        setFolderName(folder.name);
        setShowRenameModal(true);
        setOpenMenu(null);
    }

    function handleRenameFolder() {
        if (!folderName.trim() || !folderToRename) {
            return;
        }

        setFolderList((currentFolders) =>
            currentFolders.map((folder) =>
            folder.id === folderToRename.id
                ? { ...folder, name: folderName.trim() }
                : folder
            )
        );

        setFolderName("");
        setFolderToRename(null);
        setShowRenameModal(false);
    }

    function handleDeleteClick(folder) {
        setFolderToDelete(folder);
        setShowDeleteModal(true);
        setOpenMenu(null);
    }

    function handleDeleteFolder() {
        if (!folderToDelete) {
            return;
        }

        setFolderList((currentFolders) =>
            currentFolders.filter(
            (folder) => folder.id !== folderToDelete.id
            )
        );

        setFolderToDelete(null);
        setShowDeleteModal(false);
    }

    function handleOpenFolder(folder) {
        setSelectedFolder(folder);
        setOpenMenu(null);
    }
    const folderFiles = selectedFolder
    ? fileList.filter((file) => file.folderId === selectedFolder.id)
    : [];

    function handleOpenFile(file) {
        console.log("Opening file:", file.name);
    }

    function handleFileRenameClick(file) {
        setFileToRename(file);
        setFolderName(file.name);
        setShowFileRenameModal(true);
        setOpenMenu(null);
    }

    function handleRenameFile() {
        if (!folderName.trim() || !fileToRename) {
            return;
        }

        setFileList((currentFiles) =>
            currentFiles.map((file) =>
            file.id === fileToRename.id
                ? { ...file, name: folderName.trim() }
                : file
            )
        );

        setFolderName("");
        setFileToRename(null);
        setShowFileRenameModal(false);
    }

    function handleFileDeleteClick(file) {
        setFileToDelete(file);
        setShowFileDeleteModal(true);
        setOpenMenu(null);
    }

    function handleDeleteFile() {
        if (!fileToDelete) {
            return;
        }

        setFileList((currentFiles) =>
            currentFiles.filter(
            (file) => file.id !== fileToDelete.id
            )
        );
        setTrashFiles((currentTrash) => [
            ...currentTrash,
            {
                ...fileToDelete,
                deletedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
                })
            }
        ]);
        setFileToDelete(null);
        setShowFileDeleteModal(false);
    }

    function handleUploadClick(folder = null) {
        setUploadFolder(folder);
        document.getElementById("file-upload").click();
    }

    function handleFileUpload(event) {
        const selectedFile = event.target.files[0];

        if (!selectedFile || !uploadFolder) {
            return;
        }

        const newFile = {
            id: Date.now(),
            name: selectedFile.name,
            type: selectedFile.type,
            size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
            modified: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
            }),
            folderId: uploadFolder ? uploadFolder.id : null
        };

        setFileList((currentFiles) => [
            ...currentFiles,
            newFile
        ]);

        setUploadFolder(null);
        event.target.value = "";
        }
    function handleRestoreFile(file) {
  setTrashFiles((currentTrash) =>
    currentTrash.filter(
      (trashFile) => trashFile.id !== file.id
    )
  );

  setFileList((currentFiles) => [
    ...currentFiles,
    file
  ]);
}
function handlePermanentDelete(file) {
  setFileToPermanentlyDelete(file);
  setShowPermanentDeleteModal(true);
}
function confirmPermanentDelete() {
  if (!fileToPermanentlyDelete) {
    return;
  }

  setTrashFiles((currentTrash) =>
    currentTrash.filter(
      (trashFile) =>
        trashFile.id !== fileToPermanentlyDelete.id
    )
  );

  setFileToPermanentlyDelete(null);
  setShowPermanentDeleteModal(false);
}
function handleEmptyTrash() {
  setShowEmptyTrashModal(true);
}
function confirmEmptyTrash() {
  setTrashFiles([]);

  setShowEmptyTrashModal(false);
}
function handleToggleFavorite(file) {
  setFavoriteFiles((currentFavorites) => {
    const alreadyFavorite = currentFavorites.some(
      (favorite) => favorite.id === file.id
    );

    if (alreadyFavorite) {
      return currentFavorites.filter(
        (favorite) => favorite.id !== file.id
      );
    }

    return [...currentFavorites, file];
  });
}
function handleToggleFolderFavorite(folder) {
  setFavoriteFolders((currentFavorites) => {
    const alreadyFavorite = currentFavorites.some(
      (favorite) => favorite.id === folder.id
    );

    if (alreadyFavorite) {
      return currentFavorites.filter(
        (favorite) => favorite.id !== folder.id
      );
    }

    return [...currentFavorites, folder];
  });
}

  return (
    <section className="dashboard">
    {currentSection === "trash" ? (
    <TrashView
        trashFiles={trashFiles}
        folderList={folderList}
        handleRestoreFile={handleRestoreFile}
        handlePermanentDelete={handlePermanentDelete}
        handleEmptyTrash={handleEmptyTrash}
    />
    ) : currentSection === "my-files" ? (
    <MyFilesView
        fileList={fileList}
        handleOpenFile={handleOpenFile}
    />
    ) : currentSection === "favorites" ? (
    <FavoritesView
    favoriteFolders={favoriteFolders}
    favoriteFiles={favoriteFiles}
    openMenu={openMenu}
    menuDirection={menuDirection}
    handleMenuClick={handleMenuClick}
    handleOpenFile={handleOpenFile}
    handleFileRenameClick={handleFileRenameClick}
    handleFileDeleteClick={handleFileDeleteClick}
    handleToggleFavorite={handleToggleFavorite}
    handleOpenFolder={handleOpenFolder}
    handleRenameClick={handleRenameClick}
    handleDeleteClick={handleDeleteClick}
    handleToggleFolderFavorite={handleToggleFolderFavorite}
    />    ) : selectedFolder ? (
        <div className="folder-view">

        <div className="folder-view-header">
            <button
                className="back-button"
                onClick={() => setSelectedFolder(null)}
            >
                ← Back
            </button>

            <div>
                <h1>{selectedFolder.name}</h1>
                <p>{folderFiles.length} files</p>
            </div>

            <button
                className="btn btn-primary"
                onClick={() => handleUploadClick(selectedFolder)}
            >
                + Upload Files
            </button>
        </div>

       {folderFiles.length === 0 ? (
  <div className="folder-empty-state">
    <div className="folder-empty-icon">📁</div>

    <h2>This folder is empty</h2>

    <p>
      Upload files to add them to this folder.
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

       {folderFiles.map((file) => (
        <FileRow
            key={file.id}
            file={file}
            menuId={`folder-file-${file.id}`}
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
      ) : (
        <>
        
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>My Files</h1>
          <p>Manage your files and folders</p>
        </div>

        <div className="dashboard-actions">
         <button
            className="btn btn-primary"
            onClick={() => setShowFolderModal(true)}
            >
            + New Folder
        </button>

          <button className="btn btn-primary"
            onClick={() => handleUploadClick()}
          >
            ↑ Upload
          </button>
        </div>
      </div>

      {/* Folders */}
    <div className="section">
        <div className="section-header">
          <h2>Folders</h2>
          <button className="view-all-btn">
            View all
          </button>
        </div>

        <div className="folders-grid">
            {folderList.map((folder) => (
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

      {/* Recent Files */}
      <div className="section">

        <div className="section-header">
          <h2>Recent Files</h2>

          <button className="view-all-btn">
            View all
          </button>
        </div>

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
                    menuId={`file-${file.id}`}
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
      </div>
          </>
      )}
    <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleFileUpload}
    />
   {showFolderModal && (
    <div
        className="modal-overlay"
        onClick={() => setShowFolderModal(false)}
    >
        <div
        className="folder-modal"
        onClick={(event) => event.stopPropagation()}
        >
        <h2>Create New Folder</h2>

        <input
            type="text"
            placeholder="Folder name"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
        />

        <div className="modal-actions">
            <button
                className="btn btn-secondary"
                onClick={() => setShowFolderModal(false)}
            >
            Cancel
            </button>

            <button
                className="btn btn-primary"
                onClick={handleCreateFolder}
            >
                Create Folder
            </button>
        </div>
        </div>
    </div>
    )}
    {showRenameModal && (
        <div
            className="modal-overlay"
            onClick={() => setShowRenameModal(false)}
        >
            <div
            className="folder-modal"
            onClick={(event) => event.stopPropagation()}
            >
            <h2>Rename Folder</h2>

            <input
                type="text"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="Folder name"
            />

            <div className="modal-actions">
                <button
                className="btn btn-secondary"
                onClick={() => setShowRenameModal(false)}
                >
                Cancel
                </button>

                <button
                className="btn btn-primary"
                onClick={handleRenameFolder}
                >
                Save Changes
                </button>
            </div>
            </div>
        </div>
        )}
    {showDeleteModal && (
        <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
        >
            <div
            className="folder-modal delete-modal"
            onClick={(event) => event.stopPropagation()}
            >
            <h2>Delete Folder</h2>

            <p>
                Are you sure you want to delete{" "}
                <strong>{folderToDelete?.name}</strong>?
            </p>

            <div className="modal-actions">
                <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                >
                Cancel
                </button>

                <button
                className="btn btn-danger"
                onClick={handleDeleteFolder}
                >
                Delete
                </button>
            </div>
            </div>
        </div>
        )}
        {showFileRenameModal && (
        <div
            className="modal-overlay"
            onClick={() => setShowFileRenameModal(false)}
        >
            <div
            className="folder-modal"
            onClick={(event) => event.stopPropagation()}
            >
            <h2>Rename File</h2>

            <input
                type="text"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="File name"
            />

            <div className="modal-actions">
                <button
                className="btn btn-secondary"
                onClick={() => setShowFileRenameModal(false)}
                >
                Cancel
                </button>

                <button
                className="btn btn-primary"
                onClick={handleRenameFile}
                >
                Save Changes
                </button>
            </div>
            </div>
        </div>
        )}
        {showFileDeleteModal && (
        <div
            className="modal-overlay"
            onClick={() => setShowFileDeleteModal(false)}
        >
            <div
            className="folder-modal delete-modal"
            onClick={(event) => event.stopPropagation()}
            >
            <h2>Delete File</h2>

            <p>
                Are you sure you want to delete{" "}
                <strong>{fileToDelete?.name}</strong>?
            </p>

            <div className="modal-actions">
                <button
                className="btn btn-secondary"
                onClick={() => setShowFileDeleteModal(false)}
                >
                Cancel
                </button>

                <button
                className="btn btn-danger"
                onClick={handleDeleteFile}
                >
                Delete
                </button>
            </div>
            </div>
        </div>
        )}
 {showPermanentDeleteModal && (
  <div
    className="modal-overlay"
    onClick={() => {
      setShowPermanentDeleteModal(false);
      setFileToPermanentlyDelete(null);
    }}
  >
    <div
      className="folder-modal delete-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <h2>Delete permanently?</h2>

      <p>
        Are you sure you want to permanently delete{" "}
        <strong>
          {fileToPermanentlyDelete?.name}
        </strong>
        ? This action cannot be undone.
      </p>

      <div className="modal-actions">

        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowPermanentDeleteModal(false);
            setFileToPermanentlyDelete(null);
          }}
        >
          Cancel
        </button>

        <button
          className="btn btn-danger"
          onClick={confirmPermanentDelete}
        >
          Delete Permanently
        </button>

      </div>
    </div>
  </div>
)}

{showEmptyTrashModal && (
  <div
    className="modal-overlay"
    onClick={() => setShowEmptyTrashModal(false)}
  >
    <div
      className="folder-modal delete-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <h2>Empty Trash?</h2>

      <p>
        Are you sure you want to permanently delete all
        files in Trash? This action cannot be undone.
      </p>

      <div className="modal-actions">

        <button
          className="btn btn-secondary"
          onClick={() => setShowEmptyTrashModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn btn-danger"
          onClick={confirmEmptyTrash}
        >
          Empty Trash
        </button>

      </div>
    </div>
  </div>
)}
    </section>
  );
}

export default Dashboard;