function ConfirmDialog({
  open,
  title = "Please Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-dialog-overlay"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-icon">
          ⚠
        </div>

        <h3 className="confirm-dialog-title">
          {title}
        </h3>

        <p className="confirm-dialog-message">
          {message}
        </p>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={
              danger
                ? "confirm-dialog-confirm confirm-dialog-danger"
                : "confirm-dialog-confirm"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
