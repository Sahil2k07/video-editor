import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { type AlertColor } from "@mui/material/Alert";

export type NotificationState = {
    type: "success" | "warning" | "error";
    message: string;
};

type NotificationProps = {
    data: NotificationState | null;
    onClose?: () => void;
    duration?: number;
};

export default function Notification({
    data,
    onClose,
    duration = 3000,
}: NotificationProps) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<NotificationState | null>(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (data) {
            setCurrent(data);
            setKey((k) => k + 1);
            setOpen(true);
        }
    }, [data]);

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;

        setOpen(false);
        setCurrent(null);
        if (onClose) onClose();
    };

    return current ? (
        <Snackbar
            key={key}
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Alert
                onClose={handleClose}
                severity={current.type as AlertColor}
                sx={{
                    width: "100%",
                    backgroundColor:
                        current.type === "success"
                            ? "green"
                            : current.type === "warning"
                                ? "orange"
                                : "red",
                    color: "white",
                }}
            >
                {current.message}
            </Alert>
        </Snackbar>
    ) : null;
}