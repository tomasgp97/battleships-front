import { UPDATE_DISPOSITION_SUCCESS, RESET_DISPOSITION_SUCCESS } from "./index";

function updateDisposition(positions) {
  return { type: UPDATE_DISPOSITION_SUCCESS, positions };
}

function resetDisposition() {
  return { type: RESET_DISPOSITION_SUCCESS };
}

export { updateDisposition, resetDisposition };
