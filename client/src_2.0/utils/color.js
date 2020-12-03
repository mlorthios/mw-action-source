import randomColor from 'randomcolor';

const utilSubCategory = (data) => {
    switch(data) {
        case 'miseajour':
            var dat = {
                color: '#d16860',
                iconName: 'code-branch',
                iconType: 'FontAwesome5',
                iconStyle: 'solid'
            };
            return dat;
            break;
        case 'actualite':
            var dat = {
                color: '#0d77a8',
                iconName: 'newspaper',
                iconType: 'FontAwesome5',
                iconStyle: 'solid'
            };
            return dat;
            break;
        case 'rumeur':
            var dat = {
                color: '#5dcf77',
                iconName: 'bullhorn',
                iconType: 'FontAwesome5',
                iconStyle: 'solid'
            };
            return dat;
            break;
        default: 
            var dat = {
                color: randomColor({luminosity: 'dark',}),
                iconName: 'gamepad',
                iconType: 'FontAwesome5',
                iconStyle: 'solid'
            };
            return dat;
            break;
    }
}

export default utilSubCategory;