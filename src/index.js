import {Dispatcher, Store} from './flux';

const controlPanelDispatcher = new Dispatcher();

document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log(`dispatching ${name}`);
    controlPanelDispatcher.dispatch(userUpdateAction(name))
});

document.forms.fontSizeForm.size.forEach(element => {
    element.addEventListener('change', ({target}) => {
        const size = target.value;
        controlPanelDispatcher.dispatch(fontSizeUpdateAction(size))
    })
});

controlPanelDispatcher.register(action => {
    console.log(`Received Action ${action}`);
});

class UserPreferencesStore extends Store {
    getInitialState() {
        return localStorage['preferences'] ? JSON.parse(localStorage['preferences']) : {
            userName: 'Jhonny',
            fontSize: '12'
        }
    }

    __onDispatch(action) {
        console.log(`Store is ready to receive dispatch `, action);

        switch (action.type) {
            case 'UPDATE_USERNAME':
                this.__state.userName = action.value;
                this.__emitChange();
                break;
            case 'UPDATE_FONTSIZE':
                this.__state.fontSize = action.value;
                this.__emitChange();
                break;
        }
    }

    getUserPreferences() {
        return this.__state;
    }
}

const userPrefs = new UserPreferencesStore(controlPanelDispatcher);

userPrefs.addListener((state) => {
    console.log(`current state is: `, state);
    render(state);
    localStorage['preferences'] = JSON.stringify(state);
});

const render = ({userName, fontSize}) => {
    // TODO: Add code for replace inline text
    console.log('user name', userName);
    document.getElementById('userNameText').innerText = userName;
    document.getElementsByTagName('body')[0].style.fontSize = fontSize + 'px';
};

const userUpdateAction = (name) => {
    return {
        type: 'UPDATE_USERNAME',
        value: name
    }
};

const fontSizeUpdateAction = (size) => {
    return {
        type: 'UPDATE_FONTSIZE',
        value: size
    }
};

render(userPrefs.getUserPreferences());