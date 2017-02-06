import React from 'react';
import {Jumbotron, Row, Col, Grid} from 'react-bootstrap';
import {caregiverName, needsSetup, patientName, patientImage} from './webMobxStore';
import {observer} from 'mobx-react';

@observer
export default class PatientProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var cloudinaryImage = this.props.handleCloudinaryUrl([patientImage.get()], 170, 170, 'fill')
    return (
      <Grid>
        <div className='jumbo-container'>
          <Jumbotron>
            <div className='jumbo-content'>
              <img src={cloudinaryImage} className='jumbo-patient-image'/>
              <h1 className="jumbo-patient-name">{patientName.get()}</h1>
            </div>
          </Jumbotron>
        </div>
        {this.props.children && React.cloneElement(this.props.children, {
          handleLogout: this.props.handleLogout.bind(this),
          getUserInfo: this.props.getUserInfo.bind(this),
          handleCloudinaryUrl: this.props.handleCloudinaryUrl.bind(this)
        })}
      </Grid>
    )
  }
}