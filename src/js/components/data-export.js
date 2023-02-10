const exportBoxElems = document.querySelectorAll(".export-box");
const attachments = document.querySelectorAll(".attachment");
const downloadLinks = document.querySelectorAll(".export-box__button");

// Handle attachment click event
function handleAttachmentClick(event) {
  event.preventDefault();
  let attachment = event.currentTarget;
  let exportBox = attachment.closest(".export-box");
  let downloadLink = exportBox.querySelector(".export-box__button");
  // Remove active class from all attachments
  attachments.forEach(a => a.classList.remove("attachment--active"));

  // Add active class to the current attachment
  attachment.classList.add("attachment--active");

  // Check if download link was found
  if (!downloadLink) {
    throw new Error("Download link not found");
  }

  downloadLink.href = attachment.href;
}

// Add event listeners to all attachments
function addAttachmentListeners(exportBox) {
  let attachments = exportBox.querySelectorAll(".attachment");

  // Check if attachments were found
  if (attachments.length === 0) {
    throw new Error("Attachments not found");
  }

  attachments.forEach(attachment => {
    attachment.addEventListener("click", handleAttachmentClick);
  });
}

// Call addAttachmentListeners for each export box
exportBoxElems.forEach(exportBox => {
  addAttachmentListeners(exportBox);
});
