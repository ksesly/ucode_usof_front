// UpdateAvatarModal.js
import React, { useState } from 'react';
import '../../style/modal.scss';

const UpdateAvatarModal = ({ isOpen, onClose, onUpload, onFileUploaded }) => {
	const [selectedFile, setSelectedFile] = useState(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleUpload = async () => {

		if (!selectedFile) {
			console.error('No file selected for upload');
			return;
		}

		onFileUploaded(selectedFile);

		onUpload(selectedFile);

		onClose();
	};

	return (
		<div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
			<div className="modal-content">
				<button className="close-button" onClick={onClose}>
					&times;
				</button>{' '}
				<input type="file" onChange={handleFileChange} />
				<button onClick={handleUpload}>Upload</button>
			</div>
		</div>
	);
};

export default UpdateAvatarModal;
