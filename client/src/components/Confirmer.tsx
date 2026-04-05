export interface ConfirmerProps {
    id: string;
    actionDescription: string;
    action: () => void;
}

export function Confirmer({ id, actionDescription, action }: ConfirmerProps) {
    return (
        <>
            <div id={id} className="modal fade" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to {actionDescription}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={action}>Yes</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}