import {Ship} from "../components/types";
import {RESET_DISPOSITION_SUCCESS, UPDATE_DISPOSITION_SUCCESS} from "../components/actions";


const initialState: Ship[] = [];

export default (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_DISPOSITION_SUCCESS:
      return action.positions;
    case RESET_DISPOSITION_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
