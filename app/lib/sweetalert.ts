import Swal from "sweetalert2";

export const showError = (title: string, text?: string) => {
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#f59e0b",
  });
};

export const showSuccess = (title: string, text?: string) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#f59e0b",
  });
};

export const showWarning = (title: string, text?: string) => {
  Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f59e0b",
  });
};

export const showInfo = (title: string, text?: string) => {
  Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: "#f59e0b",
  });
};
