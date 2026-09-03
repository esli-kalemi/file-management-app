import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { folders, files } from "../data/mockData";

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

  return (
    <section className="dashboard">
    {currentSection === "trash" ? (
        <div className="trash-view">

            <div className="trash-view-header">
            <div>
                <h1>Trash</h1>
                <p>Files you have deleted are stored here.</p>
            </div>
            </div>

            {trashFiles.length === 0 ? (
            <div className="folder-empty-state">
                <div className="folder-empty-icon">🗑️</div>

                <h2>Trash is empty</h2>

                <p>
                Deleted files will appear here.
                </p>
            </div>
            ) : (
            <div className="files-table">

                <div className="file-row file-header">
                <span>Name</span>
                <span>Size</span>
                <span>Original Folder</span>
                <span>Deleted</span>
                </div>

                {trashFiles.map((file) => (
                <div
                    className="file-row"
                    key={file.id}
                >
                    <div className="file-name">
                    <span className="file-icon">📄</span>
                    <span>{file.name}</span>
                    </div>

                    <span>{file.size}</span>

                   <span>
                        {folderList.find(
                            (folder) => folder.id === file.folderId
                        )?.name || "No folder"}
                        </span>

                    <span>{file.deletedAt}</span>

                    <div></div>
                </div>
                ))}

            </div>
            )}

        </div>

        ) : selectedFolder ? (
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

            <div className="card-menu-container">
           <button
                className="card-menu"
                onClick={(event) => {
                    event.stopPropagation();
                    handleMenuClick(event, `folder-file-${file.id}`);
                }}
            >
                ⋮
            </button>
            {openMenu === `folder-file-${file.id}` && (
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

                    <button onClick={() => handleFileRenameClick(file)}>
                    Rename
                    </button>

                    <button onClick={() => handleFileDeleteClick(file)}>
                    Delete
                    </button>

                </div>
            )}
            </div>

        </div>
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
            <div
            className="folder-card"
            key={folder.id}
            onClick={() => handleOpenFolder(folder)}
            >
                    <div className="folder-icon">
                    📁
                    </div>

                    <div>
                    <h3>{folder.name}</h3>
                    <p>
                        {files.filter((file) => file.folderId === folder.id).length} files
                    </p>
                    </div>

                    <div className="card-menu-container">

                    <button
                        className="card-menu"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleMenuClick(event, `folder-${folder.id}`);
                        }}
                    >
                        ⋮
                    </button>

                    {openMenu === `folder-${folder.id}` && (
                        <div
                            className={`context-menu ${menuDirection}`}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button onClick={() => handleOpenFolder(folder)}>
                                Open
                            </button> 

                            <button onClick={() => handleRenameClick(folder)}>
                                Rename
                            </button>

                            <button onClick={() => handleDeleteClick(folder)}>
                                Delete
                            </button>
                        </div>
                    )}

                    </div>

                </div>
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

                <div className="card-menu-container">

                <button
                    className="card-menu"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleMenuClick(event, `file-${file.id}`);
                    }}
                >
                ⋮
                </button>

               {openMenu === `file-${file.id}` && (
                <div
                    className={`context-menu ${menuDirection}`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <button>Open</button>
                    <button>Download</button>

                    <button onClick={() => handleFileRenameClick(file)}>
                        Rename
                    </button>
                    <button onClick={() => handleFileDeleteClick(file)}>
                        Delete
                    </button>
                </div>
                )}

                </div>

            </div>
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
    </section>
  );
}

export default Dashboard;