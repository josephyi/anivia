import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

const AboutPage = props => (
  <Grid>
    <Row>
      <Col md={12}>
        <div>
          <a href="https://github.com/josephyi/anivia">Anivia</a>
          {' '}
          isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
        </div>
      </Col>
    </Row>
  </Grid>
);

export default AboutPage;
