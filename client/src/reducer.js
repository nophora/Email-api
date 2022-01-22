
const api = {

    label:'',//filter
    inbox: [],//delete
    hvlabel:[]//label list
  
  };
  
  const cliReducer = (state = api, action) => {
    switch (action.type) {
      case "LABEL":
        state = { ...state, label: action.payload };
            break;
            case "INBOX":
                state = { ...state, inbox: action.payload };
                break;
                case "HVLABEL":
                state = { ...state, hvlabel: action.payload };
                break;
      default:
        state = api;
    }
    return state;
  };

  export default cliReducer
