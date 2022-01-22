import React,{Component} from 'react';
import './route.css'
import { BrowserRouter as Router, Redirect, Switch, Route,Link } from 'react-router-dom'

import Home from './components/home'
import Senti from './components/sent'
import Unnsent from './components/unsent'
import Labels from './components/label'
import Deleted from './components/deleted'
import Ready from './components/read'
import Send from './components/send'
import Form from './components/form'
import Login from './components/login'


import Email from './components/assets/p5.png'
import Sent from './components/assets/sent.png'
import Unsent from './components/assets/unsent.png'
import Label from './components/assets/label.png'
import Delete from './components/assets/delete.png'

import Labelz from './label'
import Hvlabel from './hvlabel'

import Inbox from './inbox'


import { connect } from 'react-redux'

class Routes extends Component {
    state = { 
      size:window.innerWidth,
      label: ['math','seen', 'ocean', 'car', 'trafic','vice','phone', 'tv', 'pc', 'light', 'leven','space', 'xero', 'nine', 'arey'],
      
    greenbar: 1,

        filter: '',
        delete: [],
        user_email: '',
        change: false,
        not_login:false,
      
    }


    filters = (e) => {
        this.setState({change:false})
        this.props.Labelz(this.state.change===false?e:'')
}

    deleter = (e) => {
    
  if (this.state.user_email.length > 0 && this.state.deleting.length > 0) {
        const data = {
            user_email: this.state.user_email,
            label: e
        }


       fetch(`https://loadshedding-api.sintrex.com/getSchedules`, {
        method: 'GET',

        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJhOGpiQXI4SjQzZll5b3JxR1JWd2UzZ0Nma2wxIiwiaWF0IjoxNjI5NTU1MTAzfQ.yhk098mC7EFtPGzupMcxyJgBGGx98fms2Jb5W1siBfE'
 
        },
        body: JSON.stringify(data)

    }).then((response) => response.json()).then(data => {

      if(!data.erros){

        this.setState({
            label:data.labels
        })
        this.setState({change:true})
        this.props.Labelz(this.state.change===true?e:'')
           this.props.Hvlabel(data.labels)
           this.props.Inbox(data.inbox)
      
    }else{

        this.setState({ not_login: true })
    
        setTimeout(() => {
            this.setState({ not_login:false })
        },5000)
    }

    }).catch()
    
} else {
    this.setState({ not_login: true })
    
    setTimeout(() => {
        this.setState({ not_login: true })
    },5000)
}


        
     
   }

    
    

    greenbar = (e) => {
        this.setState({greenbar:e})  
}


     componentWillReceiveProps(nextProps) {
        if (nextProps.anyplay) {
            this.setState({
                position: nextProps.anyplay.position,
                pstate: nextProps.anyplay.pstate,
                schedules: nextProps.anyplay.schedules,
                imeko:nextProps.anyplay.imeko
            })
        }
    }

   
    size = () => {
        const wide = () => {
            this.setState({
                size: window.innerWidth
            })
             }

        window.addEventListener('resize', wide, false)


    }

    componentDidMount() {
        this.size()
        
        this.props.Inbox()

  
    }
    
    render() {

        const date = new Date();
        const year = date.getFullYear()
      
        return (
        <Router>
            <div className="copy-right">
                <div style={{flexDirection: this.state.size <=600?'column':'row'}}  className="route">
                    
                    
                    
                    <Switch>
                            <Route path="/" exact component={Home} />
                            <Route   path="/sent" exact component={Senti} />
                            <Route   path="/unsent" exact component={Unnsent} />
                            <Route   path="/label" exact component={Labels} />
                            <Route   path="/deleted" exact component={Deleted} />
                            <Route   path="/send" exact component={Send} />
                            <Route   path="/signin" exact component={Form} />
                            <Route   path="/login" exact component={Login} />
                            <Route   path="/:id" exact component={Ready} />
                       

                    </Switch>


                        {this.state.size > 600 && <div className='nav-bar'>
                        <Link  style={{ width:'100%', color: '#ffff', textDecoration: 'none' }} to="/send">
                           <div className="compose">
                            <h1 className="compose1">+</h1><h1 className="compose2">Compose</h1>  
                                </div>
                                 </Link>

                            <Link onClick={() => { this.greenbar(1) }} style={{ width:'100%', color: '#ffff', textDecoration: 'none' }} to="/">
                           <div style={{ backgroundColor:this.state.greenbar===1&&'rgba(128, 255, 0, 0.522)'}} className="mail-compose">
                           <img src={Email} alt="email" className="email" /> <h1 className="compose-inbox">Inbox</h1>  
                            </div>
                            </Link>
                                
                            <Link onClick={() => { this.greenbar(2) }} style={{  width:'100%',color: '#ffff', textDecoration: 'none' }} to="/sent">
                           <div style={{ backgroundColor:this.state.greenbar===2&&'rgba(128, 255, 0, 0.522)'}} className="mail-compose1">
                           <img src={Sent} alt="sent" className="emails" /> <h1 className="compose-inboxs">Sent</h1>  
                            </div>
                            </Link>

                            
                            <Link onClick={() => { this.greenbar(3) }} style={{  width:'100%',color: '#ffff', textDecoration: 'none' }} to="/unsent">
                            <div style={{ backgroundColor:this.state.greenbar===3&&'rgba(128, 255, 0, 0.522)'}} className="mail-compose1">
                           <img src={Unsent} alt="unsent" className="email" /> <h1 className="compose-inbox">Undelivered</h1>  
                                </div>
                                 </Link>
                                 <Link onClick={() => { this.greenbar(4) }} style={{ width:'100%', color: '#ffff', textDecoration: 'none' }} to="/label">
                            <div style={{ backgroundColor:this.state.greenbar===4&&'rgba(128, 255, 0, 0.522)'}} className="mail-compose2">
                           <img src={Label} alt="label" className="emaill" /> <h1 className="compose-inboxl">Label</h1>  
                                </div>
                            </Link>


                            {this.state.greenbar === 4 && <div className="label-div">
                                <div className="all-label">
                                    <span className="faka">All label</span>
                                </div>
                                <div className="labe-scroll">
                                    <div className="labe-scroll2">
                                        <div className="labe-scroll3">
                              
                                            {this.state.label.map(e => {
                                                return (<div ker={e} className="all-label2">
                                                    <div onClick={() => { this.filters(e) }} className="all-label3">
                                                    <div className="dots"></div><span className='lecture'>{e}</span>
                                                </div>
                                                    <img onClick={() => { this.deleter(e) }} src={Delete} alt='delete' className="delete-back"/>
                                                    </div>
                                                    )
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>}
                            
                            <Link onClick={() => { this.greenbar(5) }} style={{ width:'100%', color: '#ffff', textDecoration: 'none' }} to="/deleted">
                            <div style={{ backgroundColor:this.state.greenbar===5&&'rgba(128, 255, 0, 0.522)'}} className="mail-compose1">
                           <img src={Delete} alt="delete" className="emaild" /> <h1 className="compose-inbox">Deleted</h1>  
                                </div>
                                </Link>

                    </div>}


                    
                    {this.state.size>600&&this.state.pstate&&this.state.schedules.map(e=>{return(<div key={e.province} style={{ marginTop: `${this.state.position.screeny - 80}px`, marginLeft: `${this.state.position.screenx}px` }} className="hover-board">
                        <span className="west">{e.province}</span>
                        <div className="hover-board-2">

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Zone:</span>
                                <span className="after-do">{e.zone}</span>
                            </div>

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Stage:</span>
                                <span className="after-do">{e.stage}</span>
                            </div>

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Dom:</span>
                                <span className="after-do">{e.dom}</span>
                            </div>

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Time:</span>
                                <span className="after-do">{e.time}</span>
                            </div>

                        </div>
                    </div>)})}

                    {this.state.size <=600 && this.state.pstate && <div style={{ width: `${window.innerWidth}px`, height: `${window.innerHeight}px` }} className="moble-stage">
                    {this.state.schedules.map(e=>{return(<div style={{height: '140px'}} key={e.province}  className="hover-board">
                        <div className="mob-x">
                            <div onClick={this.hbord}  className="x-hbord">
                                <div className="s-x1"></div>
                                <div className="s-x2"></div>
                            </div>
                        </div>
                        <span className="west">{e.province}</span>
                        <div className="hover-board-2">

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Zone:</span>
                                <span className="after-do">{e.zone}</span>
                            </div>

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Stage:</span>
                                <span className="after-do">{e.stage}</span>
                            </div>

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Dom:</span>
                                <span className="after-do">{e.dom}</span>
                            </div>

                            <div className="hover-board-x">
                                <div className="dot"></div>
                                <span className="after-dot">Time:</span>
                                <span className="after-do">{e.time}</span>
                            </div>

                        </div>
                    </div>)})}
                    </div>}


                </div>

                    {this.state.imeko && <div style={{ filter: this.state.size <= 600 && this.state.pstate && 'blur(11px)', marginLeft: this.state.size <= 600 && '0px', }} className="copy-right-info">
                     
                      
                        
                     <div className="right-spliting">
                        <span className="load-api">Load Shedding SA</span>
                        <span className="load-api-2">Load shedding REST API powered by Sintrex</span>
                        <div className="all-right">
                            <span>{`Copyright  ©${year}`}</span>
                            <Link style={{ color: 'rgb(186, 186, 186)', textDecoration: 'none' }} to="/privacy"> 
                            <span>· Privacy</span>
                            </Link>
                            <Link style={{ color: 'rgb(186, 186, 186)', textDecoration: 'none' }} to="/terms-and-conditions">  
                            <span>· Terms</span>
                                </Link>
                                <Link style={{ color: 'rgb(186, 186, 186)', textDecoration: 'none' }} to="/about">  
                            <span>· About Us</span>
                                </Link>
                                <Link style={{ color: 'rgb(186, 186, 186)', textDecoration: 'none' }} to="/about">  
                            <span>· Contact Us</span>
                            </Link>
                            <span>· All right reserved</span></div>
                    </div>
                    
                    </div>}

                </div>

        </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        anyplay: state.cliReducer,
    }
};
 
export default connect(mapStateToProps, {Inbox,Labelz,Hvlabel})(Routes);
