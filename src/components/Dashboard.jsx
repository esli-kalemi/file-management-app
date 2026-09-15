import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { folders, files } from "../data/mockData";
import FileRow from "./FileRow";
import FolderCard from "./FolderCard";
import TrashView from "./TrashView";
import MyFilesView from "./MyFilesView";
import FavoritesView from "./FavoritesView";

import {
    getFolders,
    createFolder,
    renameFolder
} from "../api/folders";
import { 
  getFiles,
  renameFile,
  uploadFile,
  getDownloadUrl
 } from "../api/files";

function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function Dashboard({ currentSection, setCurrentSection, searchTerm }) {

    const [openMenu, setOpenMenu] = useState(null);
    const [menuDirection, setMenuDirection] = useState("down");
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [folderList, setFolderList] = useState([]);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [folderToRename, setFolderToRename] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [fileList, setFileList] = useState([]);

    const [fileToRename, setFileToRename] = useState(null);
    const [showFileRenameModal, setShowFileRenameModal] = useState(false);

    const [fileToDelete, setFileToDelete] = useState(null);
    const [showFileDeleteModal, setShowFileDeleteModal] = useState(false);

    const [uploadFolder, setUploadFolder] = useState(null);
    const [trashFiles, setTrashFiles] = useState([]);
    const [trashFolders, setTrashFolders] = useState([]);
    const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
    const [fileToPermanentlyDelete, setFileToPermanentlyDelete] = useState(null);
    const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
    const [favoriteFiles, setFavoriteFiles] = useState([]);
    const [favoriteFolders, setFavoriteFolders] = useState([]);
    const [showAllFolders, setShowAllFolders] = useState(false);
    const filteredFiles = fileList.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredFolders = folderList.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredFavoriteFiles = favoriteFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredFavoriteFolders = favoriteFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
);

    useEffect(() => {
      async function loadData() {
          try {
              const [foldersResponse, filesResponse] = await Promise.all([
                  getFolders(),
                  getFiles()
              ]);

              const backendFolders = foldersResponse.data.map((folder) => ({
                  id: folder.id,
                  name: folder.name,
                  fileCount: 0,
                  parentId: folder.parent_id
              }));

              const backendFiles = filesResponse.data.map((file) => ({
                  id: file.id,
                  name: file.original_name,
                  type: file.mime_type,
                  size: formatFileSize(file.size),
                  modified: formatDate(file.updated_at),
                  folderId: file.folder_id
              }));

              setFolderList(backendFolders);
              setFileList(backendFiles);
          } catch (error) {
              console.error("Failed to load data:", error);
              setFolderList(folders);
              setFileList(files);
          }
      }

      loadData();
  }, []);

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

    async function handleCreateFolder() {
        if (!folderName.trim()) {
            return;
        }

        try {
            const response = await createFolder(folderName.trim());

            const newFolder = {
                id: response.data.id,
                name: response.data.name,
                fileCount: 0,
                parentId: response.data.parent_id
            };

            setFolderList((currentFolders) => [
                ...currentFolders,
                newFolder
            ]);

            setFolderName("");
            setShowFolderModal(false);
        } catch (error) {
            console.error("Failed to create folder:", error.message);
        }
    }

    function handleRenameClick(folder) {
        setFolderToRename(folder);
        setFolderName(folder.name);
        setShowRenameModal(true);
        setOpenMenu(null);
      }

      async function handleRenameFolder() {
        if (!folderName.trim() || !folderToRename) {
            return;
        }

        try {
            const response = await renameFolder(
                folderToRename.id,
                folderName.trim()
            );

            const updatedFolder = response.data;

            setFolderList((currentFolders) =>
                currentFolders.map((folder) =>
                    folder.id === folderToRename.id
                        ? {
                            ...folder,
                            name: updatedFolder.name
                        }
                        : folder
                )
            );

            setFolderName("");
            setFolderToRename(null);
            setShowRenameModal(false);
        } catch (error) {
            console.error(
                "Failed to rename folder:",
                error.message
            );
        }
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

        setTrashFolders((currentTrash) => [
            ...currentTrash,
            {
                ...folderToDelete,
                deletedAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })
            }
        ]);

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
      const downloadUrl = getDownloadUrl(file.id);

      window.open(downloadUrl, "_blank");
    }

    function handleFileRenameClick(file) {
        setFileToRename(file);
        setFolderName(file.name);
        setShowFileRenameModal(true);
        setOpenMenu(null);
    }

    async function handleRenameFile() {
      if (!folderName.trim() || !fileToRename) {
          return;
      }

      try {
          const response = await renameFile(
              fileToRename.id,
              folderName.trim()
          );

          const updatedFile = response.data;

          setFileList((currentFiles) =>
              currentFiles.map((file) =>
                  file.id === fileToRename.id
                      ? {
                          ...file,
                          name: updatedFile.original_name
                      }
                      : file
              )
          );

          setFolderName("");
          setFileToRename(null);
          setShowFileRenameModal(false);
      } catch (error) {
          console.error(
              "Failed to rename file:",
              error.message
          );
      }
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

  async function handleFileUpload(event) {
      const selectedFile = event.target.files[0];

      if (!selectedFile) {
          return;
      }

      try {
          const folderId = uploadFolder
              ? uploadFolder.id
              : null;

          const response = await uploadFile(
              selectedFile,
              folderId
          );

          const uploadedFile = response.data;

          const newFile = {
              id: uploadedFile.id,
              name: uploadedFile.original_name,
              type: uploadedFile.mime_type,
              size: formatFileSize(uploadedFile.size),
              modified: formatDate(uploadedFile.updated_at),
              folderId: uploadedFile.folder_id
          };

          setFileList((currentFiles) => [
              ...currentFiles,
              newFile
          ]);

          setUploadFolder(null);
          event.target.value = "";
      } catch (error) {
          console.error(
              "Failed to upload file:",
              error.message
          );
      }
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
function handleRestoreFolder(folder) {
  setTrashFolders((currentTrash) =>
    currentTrash.filter(
      (trashFolder) => trashFolder.id !== folder.id
    )
  );

  setFolderList((currentFolders) => [
    ...currentFolders,
    folder
  ]);
}
function handlePermanentDeleteFolder(folder) {
  setTrashFolders((currentTrash) =>
    currentTrash.filter(
      (trashFolder) => trashFolder.id !== folder.id
    )
  );
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
  setTrashFolders([]);
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
    trashFolders={trashFolders}
    folderList={folderList}
    handleRestoreFile={handleRestoreFile}
    handleRestoreFolder={handleRestoreFolder}
    handlePermanentDelete={handlePermanentDelete}
    handlePermanentDeleteFolder={handlePermanentDeleteFolder}
    handleEmptyTrash={handleEmptyTrash}

    />
    ) : currentSection === "my-files" ? (
    <MyFilesView
        fileList={filteredFiles}
        openMenu={openMenu}
        menuDirection={menuDirection}
        handleMenuClick={handleMenuClick}
        handleOpenFile={handleOpenFile}
        handleFileRenameClick={handleFileRenameClick}
        handleFileDeleteClick={handleFileDeleteClick}
        favoriteFiles={favoriteFiles}
        handleToggleFavorite={handleToggleFavorite}
    />
    ) : currentSection === "favorites" ? (
    <FavoritesView
    favoriteFolders={filteredFavoriteFolders}
    favoriteFiles={filteredFavoriteFiles}
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
           <button
            className="view-all-btn"
            onClick={() => setShowAllFolders(!showAllFolders)}
        >
            {showAllFolders ? "Show less" : "View all"}
        </button>
        </div>

        <div className="folders-grid">
        {(showAllFolders
            ? filteredFolders
            : filteredFolders.slice(0, 3)
        ).map((folder) => (            
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

            <button
                className="view-all-btn"
                onClick={() => setCurrentSection("my-files")}
                >
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

                {filteredFiles.map((file) => (
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