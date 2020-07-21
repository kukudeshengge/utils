/**富文本编辑器
 * **/
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import E from 'wangeditor'
import Validate from './validate'
import { Link, browserHistory } from 'react-router'
import PropTypes from 'prop-types';
import '../components/ticketModal/index.less'
import './MailboxTemp.less'
import { Input,Form,Radio ,Checkbox,message,Upload, Button, Icon,notification,Row,Col} from 'antd';
const FormItem = Form.Item;
let headers=(Validate.cookieValue(document.cookie,'ekt_access_token') || '');
class MailboxTemp extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            editorContent: ' ',
            content:{},
            fileList: [],
        }
        this.UphandleChange = (info) => {
            let fileList = info.fileList;
            /*let filelistcall=[];*/
            let UpType=false;
            fileList = fileList.map((file, i) => {
                if (file.response) {
                  if (file.response.code == 0) {
                      UpType=true;
                        file.url = file.response.url;
                      /*filelistcall.push({name:file.name,url:file.response.data})*/
                    } else {
                        if(file.uid==info.file.uid){
                            fileList.splice(i,1);
                            message.error(`${info.file.name} 文件上传失败！`);
                            return;
                        }

                    }
                }else {
                    if(file.size>1048576*8){
                        fileList.splice(i,1);
                    }
                }
                return file;
            });
            if(Validate.isEmpty(fileList)||fileList.length<1){
                UpType=true;
                this.state.fileList = [];
                this.setState({fileList:[]});
            }else {
                this.state.fileList = info.fileList;
                this.setState({fileList:info.fileList});
            }

            if (UpType==true){
                this.props.callbackParent('file', this.state.fileList);
            }
        }
    }
    handleChange (e) {
        /*value = this.editor.root.innerHTML;*/
        if(!Validate.isEmpty(e)&&e!="<p><br></p>"){
            this.props.callbackParent('conten',e);
        }else{
            this.props.callbackParent('conten',"");
        }
    }
    keyupChange(e){
        let innerHTML="";
        if(!Validate.isEmpty(e.target)&&!Validate.isEmpty(e.target.innerHTML)){
            innerHTML=e.target.innerHTML;
        }
        if(!Validate.isEmpty(innerHTML)&&innerHTML!="<p><br></p>"){
            this.props.callbackParent('conten',innerHTML);
        }else{
            this.props.callbackParent('conten',"");
        }
    }
    cancelClick(){
        /*this.refs.editorElem.innerText=""*/
        this.props.callbackParent('cance',"");
    }
    saveClick(){
        this.props.callbackParent('save',"");
    }
    keydown(e){
        let aa=e;
    }
    componentWillUnmount() {
        this.editor = null;
    }
    componentDidMount() {

        const elem = this.refs.editorElem;
        this.editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
            this.setState({
                editorContent: html
            })
            let isEmpty = html.replace(/<.*?>/ig, '').replace(/&nbsp;/g, "").trim();
            this.props.form.setFieldsValue({content:isEmpty})
        };
        this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024
        this.editor.customConfig.withCredentials = true
        this.editor.customConfig.uploadImgServer = '/v1/ticket/upload/files?access-token='+headers
        this.editor.customConfig.uploadFileName = 'file';
        this.editor.customConfig.onchange=this.handleChange.bind(this)

        this.editor.customConfig.menus = [
            'head',  // 标题
            'fontName',  // 字体
            'fontSize',  // 字号
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'bold',  // 粗体
            'italic',  // 斜体
            'underline',  // 下划线
            'list',  // 列表
            'justify',  // 对齐方式
            'image',  // 插入图片
            'link',  // 插入链接
            'code',  //html
        ];
        this.editor.customConfig.uploadImgHooks = {
            before: (xhr, editor, files)=> {
                // 图片上传之前触发
            },
            success:(xhr, editor, result)=> {
                message.success("图片插入文本框成功")
            },
            fail:(xhr,editor, result)=>{
                message.error("图片插入文本框失败")
            },
            error:(xhr,editor)=>{
                message.error("图片上传出错")
            },
            timeout:(xhr, editor)=>{
                message.error("图片上传超时")
            },
            customInsert: (insertImg, result, editor)=> {
                if(!result.code===200){
                    return;
                }
                let url = result.data;
                insertImg(url)
            }
        }


        this.editor.create();


        this.refs.editorElem.addEventListener('keyup', this.keyupChange.bind(this));
        const { onRef = () => {} } = this.props;
        onRef(this);


        if(!Validate.isEmpty(this.props)){

            if(this.props.hasOwnProperty('onPostValue')){
                this.editor.txt.html(this.props.onPostValue);
            }
            if(this.props.hasOwnProperty('fileList')&&!Validate.isEmpty(this.props.fileList)&&this.props.fileList.length>0){
                /*this.state.fileList=this.props.fileList;*/
                this.setState({fileList:this.props.fileList});
            }
        }


        const { emailActions } = this.props
    }
    beforeUpload(file){
        if(file && !Validate.isEmpty(file.size)){
            let isLtMax = file.size < 1048576*8;
            if (!isLtMax) {
                notification.warning({
                    'message': '提示',
                    'description': '请选择大小在8M以内'
                });
            }
            return isLtMax;
        }
    }
    render() {
        //放开
        const props = {
            action: '/v1/ticket/upload/files',
            onChange: this.UphandleChange,
            beforeUpload:this.beforeUpload.bind(this),
            multiple: true,
            headers: {"access-token": headers},
        };
        let showType='hideNew';
        if(this.props.MailType=='accept'){
            showType='showNew';
        }


        const ModalType=this.props.ModalType;
        let Col_up=5;
        let Col_sm=14;
        if(ModalType=='ticketAccept'){
            Col_up=7;
            Col_sm=14;
        }
        return (
            <div>
                <div className="editor">
                    <div ref="editorElem" className="toolbar"></div>
                </div>
                <Row style={{margin: '10px 0'}}>
                    <Col span={Col_up}>
                        <Upload {...props} fileList={this.state.fileList}>
                            <Button type="primary">
                                <Icon type="upload"/> 添加附件
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={Col_sm} style={{padding:'5px 10px 5px 0'}}>
                        <h4>(附件大小不可超过8M)</h4>
                    </Col>
                    {/*<Col className={showType} span={3} style={{textAlign:'right'}}>
                        <Button onClick={this.cancelClick.bind(this)}>取消</Button>
                    </Col>*/}
                   {/* <Col className={showType} span={3} style={{textAlign:'right'}}>
                        <Button onClick={this.saveClick.bind(this)} >保存</Button>
                    </Col>*/}
                </Row>
            </div>
        )
    }
}
MailboxTemp = Form.create()(MailboxTemp);
export default connect()(MailboxTemp);

