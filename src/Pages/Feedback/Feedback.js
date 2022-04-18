import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import md5 from 'crypto-js/md5';
import Header from '../../Componentes/Header';
import './feedbackStyle.css';
import { saveScore } from '../../Helpers/ranking';

class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      image: '',
      redirect: false,
    };
  }

  componentDidMount() {
    const { userEmail, userName, currentScore } = this.props;
    const emailToUse = md5(userEmail).toString();
    const URL = `https://www.gravatar.com/avatar/${emailToUse}`;
    this.setState({ image: URL });
    saveScore(userName, currentScore, URL);
  }

  handleClick = () => {
    this.setState({ redirect: true });
  }

  messages = () => {
    const { assertions } = this.props;
    const minAnswers = 3;
    if (assertions < minAnswers) {
      return 'Could be better...';
    }
    return 'Well Done!';
  }

  render() {
    const { image, redirect } = this.state;
    const { userName, score, currentScore, assertions } = this.props;
    return (
      <div className="feedback">
        <div className="feedback-body">
          <Header image={ image } name={ userName } score={ currentScore } />
          <div className="feedback-points">
            <h4>
              Respostas corretas:
              {' '}
              <span data-testid="feedback-total-question">{assertions}</span>
            </h4>
            <h4>
              Pontuação total:
              {' '}
              <span data-testid="feedback-total-score">{score}</span>
            </h4>
          </div>
          <p data-testid="feedback-text">{this.messages()}</p>
          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ () => {
              const { history } = this.props;
              history.push('/ranking');
            } }
            className="feedback-buttons"
          >
            Ranking
          </button>
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ this.handleClick }
            className="feedback-buttons"
          >
            Play Again
          </button>
          {redirect && <Redirect to="/" />}
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  userEmail: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  currentScore: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

const mapStateToProps = (store) => ({
  userName: store.player.name,
  userEmail: store.player.gravatarEmail,
  score: store.player.score,
  currentScore: store.player.currentScore,
  assertions: store.player.assertions,
});

export default connect(mapStateToProps, null)(Feedback);
