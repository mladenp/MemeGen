import React, {Component} from 'react';
import '../App.css';
import BodyRender from './BodyRender';
import WebFont from 'webfontloader';







class Body extends Component {
    constructor(props){
        super(props);
        this.handleChange =   this.handleChange.bind(this);
        this.handleSubmit =   this.handleSubmit.bind(this);
        this.getBase64Image = this.getBase64Image.bind(this);
        this.chooseFont = this.chooseFont.bind(this);
        this.chooseOpac = this.chooseOpac.bind(this);



        this.state = {
            topText:'Top Text',
            bottomText:' Bottom Text',
            middleText: 'Middle Text',
            randomImg:'https://i.imgflip.com/1otk96.jpg',
            allMemes: null,
            memeName:'',
            hideOrshow: 'showhideimg',
            currentImagebase64: null,
            topY: "10%",
            topX: "50%",
            bottomX: "50%",
            bottomY: "90%",
            selectedFile:'',
            allFonts: null,
            fontFam: '',
            rotImg: 'rotate90',
            opacity:'',
            filter:''
        }
    };


    componentDidMount(){
        fetch("https://api.imgflip.com/get_memes")
        .then(dataHere =>  dataHere.json()
        )
        .then( response => {
            const {memes} = response.data;  //response.data je objekat i onda odatle uzmi vrednosti memes objekta
        fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDiLaPS4sIZ07PDUySo4FTZiLigDcfwRgk')
        .then(data =>{
            return data.json();
        })
        .then(resp => {
            this.setState({
                allFonts: resp.items,
                allMemes: memes 
             })
        })
        });
    };




    handleChange(event){  
        const {name, value} = event.target;
        this.setState({ [name]:value }) 
    };


    handleSubmit(event){
    if(this.state.allMemes){        //if its' true do this, only if TRUE
        this.setState({selectedFile: ''})
        event.preventDefault()
        const randNum = Math.floor(Math.random() * Math.floor(this.state.allMemes.length));
        const eachMeme = this.state.allMemes[randNum].url;
        const eachMemeName = this.state.allMemes[randNum].name;
        const eachMemeWidth = this.state.allMemes[randNum].width;
        const eachMemeHeight = this.state.allMemes[randNum].height;
        this.setState({
            randomImg:eachMeme,
            memeName: eachMemeName,
            memeWidth: eachMemeWidth,
            memeHeight: eachMemeHeight
        })
        setTimeout(() => { this.setState({hideOrshow: ''}) }, 100)
        const baseImage = new Image();
        baseImage.setAttribute('crossOrigin', 'anonymous');
        baseImage.src =  this.state.selectedFile ?  this.state.selectedFile : eachMeme;
        baseImage.onload = () => { 
        const base64 = this.getBase64Image(baseImage);
        this.setState({ currentImagebase64: base64 })
        }
    }
    };




    convertSvgToImage = (event) => {
        event.preventDefault();
        const svg =  this.child.svgRef
        let svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        const svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        const img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
        img.onload = function() {
          canvas.getContext("2d").drawImage(img, 0, 0);
          const canvasdata = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.download = "meme.png";
          a.href = canvasdata;
          document.body.appendChild(a);
          a.click();
        };
    };

    

    getBase64Image(img){
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    };


    fileSelectHandler = event => {
        const {files} = event.target
        console.log('files nula', files[0])
        this.setState({selectedFile: URL.createObjectURL(files[0])})
    };


    chooseFont(event){
        const {value} = event.target
        this.setState({fontFam: value })
        WebFont.load({ google: { families: [`${value}:300,400,700`, 'sans-serif'] } });
    };


    chooseOpac(event){
    const {name, value} = event.target
    console.log('vrednost:', value)
    this.setState({[name]: value })
    };


    render(){
        if(!this.state.allFonts){
            return <div/>  //this will render just this empty div container and prevent from rendering values that didn't returned from API
        }
        const allProps = [
            this.state,
            {
            handleChange: this.handleChange,
            handleSubmit: this.handleSubmit,
            convertSvgToImage:  this.convertSvgToImage,
            getBase64Image:  this.getBase64Image,
            fileSelectHandler: this.fileSelectHandler,
            chooseFont: this.chooseFont,
            chooseOpac: this.chooseOpac
            }
        ];

        return (
            <div>
            <BodyRender
            {...allProps}
            ref={(el) => { this.child = el; }}
            />
            </div>
        )
    };
}



export default Body;




