import WikiResults from './components/WikiResults'
import './App.css';
import {Container, Row, Col} from 'reactstrap'

const App = () => {

  return (
    <Container style={{padding: "15px"}}>
      <Row>
          <Col>
            <WikiResults/>
          </Col>  
      </Row>
    </Container>
  );
}

export default App;
