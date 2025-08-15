function copyAccountNumber(elementId, buttonElement) {
  const accountNumber = document.getElementById(elementId).textContent.trim();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        showCopied(buttonElement);
      })
      .catch((err) => {
        console.error("Clipboard API gagal:", err);
        fallbackCopy(accountNumber, buttonElement);
      });
  } else {
    fallbackCopy(accountNumber, buttonElement);
  }
}

function fallbackCopy(text, buttonElement) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  showCopied(buttonElement);
}

function showCopied(buttonElement) {
  const originalText = buttonElement.innerHTML;
  buttonElement.innerHTML = "✅ Berhasil Disalin!";
  buttonElement.classList.add("copied");
  setTimeout(() => {
    buttonElement.innerHTML = originalText;
    buttonElement.classList.remove("copied");
  }, 2000);
}
