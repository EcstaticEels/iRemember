import { Actions } from 'react-native-router-flux';
var FileUpload = require('NativeModules').FileUpload;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  photoSelectorContainer: {
    borderColor: '#5D6D7E',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    justifyContent: 'space-around',
    borderRadius: 100,
  },
});
export default class ImageEffects extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      source: null,
      colorFamily: null,
    };
    this.sendToApi = this.sendToApi.bind(this);
    }
    componentWillMount(){
        console.log('here:',this.props);
        window.temp = this.props.photoSource.uri;
    }
    sendToApi (){
        console.log('source',window.temp);
        
        var obj = {
          uploadUrl: 'https://apicloud-colortag.p.mashape.com/tag-file.json',
          method: 'POST', // default 'POST',support 'POST' and 'PUT' 
          headers: {
            'Accept': 'application/json',
            'X-Mashape-Key': 'TV1rwHm368mshLO2ONI1Dp4owetOp18tBYMjsnHpj9IJjkOrZ7',
          },
          fields: {
              'temp': 'temp',
          },
          files: [
            {
              filename: window.temp.slice(36, window.temp.length), // require, file name 
              filepath: window.temp.slice(8, window.temp.length), // require, file absoluete path 
              filetype: '', // options, if none, will get mimetype from `filepath` extension 
            },
          ]
        }
    };
    
    
    FileUpload.upload(obj, function(err, result) {
      console.log('upload:', result.data);
      Alert.alert('Success!',
            'New Color Family Successfully Uploaded and Saved!',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed!')},
            ]
          );
      var colors = JSON.parse(result.data);
      console.log(colors);
      var palette = {
                color1: {hex: colors.tags[0].color, name: colors.tags[0].label}, 
                color2: {hex: colors.tags[1].color, name: colors.tags[1].label},
                color3: {hex: colors.tags[2].color, name: colors.tags[2].label},
                color4: {hex: colors.tags[3].color, name: colors.tags[3].label},
                color5: {hex: colors.tags[4].color, name: colors.tags[4].label}
              };
              var name = 'From Photo App';
              console.log('data', {name: name, palette: palette});
              
              fetch('http://138.197.5.105:3000/api/colors', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name, palette: palette})
              }).then((success) => {
                console.log('success', success);
                
              }).catch((error) => {
                console.log('error', error);
              });
    });
    }
    