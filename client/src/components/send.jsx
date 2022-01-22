import React, { Component } from 'react'
import './home.css'
import { Redirect} from 'react-router-dom'

import { connect } from 'react-redux'

class Send extends Component {
    state = {
        size: window.innerWidth,
        item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        search: '',
        to: '',
        words:'',
        subject:'',
        invalid: false,
        emails:[],
        email:JSON.parse(localStorage.getItem('accont'))[0].user_email
    }


    size = () => {
        const wide = () => {
            this.setState({
                size: window.innerWidth
            })
             }
      console.log('size',window.innerWidth)
        window.addEventListener('resize', wide, false)
    }


    componentDidMount() {
        this.size()
        window.scrollTo({
            behavior: 'smooth',
            top: 0
        })

      }

    
      handleSeach = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value })
    }; 

    add_mail = () => {
        
        const include = this.state.to.split('').includes('@' && '.')
      
        if (include === true && this.state.to.length > 6) {
            this.setState({
                emails: [...this.state.emails, ...[this.state.to]],
           to:''
            })
        } else {
            this.setState({ invalid: true })
            setTimeout(() => {
                this.setState({ invalid: false })
            },1000)
            
        }

    }


    deletex = (e) =>{
        this.setState({emails:this.state.emails.filter(i=>i!==e)})
    }


    submite = () => {

     
        if ( this.state.email.length>0&&this.state.subject.length>0&&this.state.words.length>0) {
     

            const data = {
                from: this.state.email,
                to: this.state.emails,
                subject:this.state.subject,
                compose: this.state.words,
                label: { text: 'none', color: 'none' },
                delete_color: 'false',
                date:`${Date.now()}`,
            }


            fetch(`http://localhost:8080/email/sendemail`, {
                method: 'POST',
        
                headers: {
                    'content-type': 'application/json',
                   // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJhOGpiQXI4SjQzZll5b3JxR1JWd2UzZ0Nma2wxIiwiaWF0IjoxNjI5NTU1MTAzfQ.yhk098mC7EFtPGzupMcxyJgBGGx98fms2Jb5W1siBfE'
                    'x-auth-token' :JSON.parse(localStorage.getItem('accont'))[0].token
                },
                body: JSON.stringify(data)
     
            }).then((response) => response.json()).then(data => {
  
              if(!data.erros){

                 console.log('data',data)
                  
                this.setState({
                    inbox: data.inbox,
                    deleting:[],
                    
                })
            }else{

                this.setState({  invalid: true  })
            
                setTimeout(() => {
                    this.setState({ invalid: false })
                },5000)
            }

            }).catch()
        
        
        
        
        } else {
            this.setState({ invalid: true })
            setTimeout(() => {
                this.setState({ invalid: false })
            },1000)
            
        }

    }



    render() {
        
       const data = JSON.parse(localStorage.getItem('accont'))
        if (data === null) {
        // <Redirect to='/signin' />
        }
        return (
            <div style={{ marginLeft: this.state.size <= 600 && '0px', height: `${window.innerHeight-30 }px`}} className="home">
                
                <div className="home-body">

                <div className="send-body">
                <div className="send-body2">
                            <div className="sendbar">
                                <span className="new-meg">New Message</span>
                                {this.state.invalid && <div className="inveik"><span>invelid email</span></div>}
                            </div>
                            <div className="sendbar-do">
                                <div className="to-email">
                                             <input value={this.state.to} name='to' onChange={this.handleSeach} placeholder='' className='text-inputx' />
                    <div onClick={this.add_mail} className="add-plus"><span>+</span></div>
                                </div>
                                <div className="to-email">
                                    <span>Subject :</span>
                                    <input value={this.state.subject} name='subject' onChange={this.handleSeach} placeholder='' className='text-inputx' />
                                </div>

                                <div className="to-email">
                                <textarea name='words' value={this.state.words.slice(0,220)} placeholder='Compose' onChange={this.handleSeach} className='textareas'></textarea>
                                </div>

                            </div>
                            <div className="to-emailx">
                            <div onClick={this.submite} className="to-emailse">
                                    <span>Send</span>
                                </div>
                                </div>
                       </div>
                </div>
                </div>

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        anyplay: state.cliReducer,
    }
};


export default connect(mapStateToProps, {})(Send);

