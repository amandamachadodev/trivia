import React from 'react';
import { decode } from 'html-entities';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import {
  saveScore,
  saveCurrentScore,
  saveAssertions,
  thunkToken,
} from '../../Redux/actions/index';
import Header from '../../Componentes/Header';
import './gameStyle.css';
import { getQuestions, getAnswers } from '../../Helpers/gameFunctions';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      currentQuestion: 0,
      image: '',
      questionAnswered: false,
      timer: 30,
      answers: [],
      questionDifficulties: {
        easy: 1, medium: 2, hard: 3,
      },
    };
  }

  async componentDidMount() {
    const { userEmail, getToken, token, category, difficulty,
      questionType, updateCurrentScore, updateAssertion } = this.props;
    const questions = await getQuestions(token || await getToken(), getToken,
      { category, difficulty, questionType });
    const answers = getAnswers(questions[0]);
    const emailToUse = md5(userEmail).toString();
    const URL = `https://www.gravatar.com/avatar/${emailToUse}`;
    this.setState({ questions, answers, image: URL });
    this.activateInterval();
    updateCurrentScore(0);
    updateAssertion(0);
  }

  componentWillUnmount() {
    clearInterval(this.intervalTimerID);
  }

  activateInterval = () => {
    const interval = 1000;
    this.setState({ timer: 30 });
    this.intervalTimerID = setInterval(() => {
      const { timer } = this.state;
      this.setState({ timer: timer - 1 });
      if (timer - 1 === 0) {
        this.setState({ questionAnswered: true });
        clearInterval(this.intervalTimerID);
      }
    }, interval);
  }

  renderQuestion = () => {
    const { questions, currentQuestion } = this.state;
    if (currentQuestion < questions.length) {
      const question = questions[currentQuestion];
      return (
        <section>
          <h2 data-testid="question-category">{decode(question.category)}</h2>
          <p data-testid="question-text">{decode(question.question)}</p>
        </section>
      );
    }
  }

  addPoints = () => {
    const { questions, currentQuestion, timer, questionDifficulties } = this.state;
    const { updateScore, updateCurrentScore,
      updateAssertion, score, currentScore, assertions } = this.props;
    let { difficulty } = questions[currentQuestion];
    difficulty = questionDifficulties[difficulty];
    const ten = 10;
    const points = ten + (timer * difficulty);
    updateScore(score + points);
    updateCurrentScore(currentScore + points);
    updateAssertion(assertions + 1);
  }

  generateAnswersButton = () => {
    const { questionAnswered, questions, currentQuestion, answers } = this.state;
    const question = questions[currentQuestion];
    const correctAnswer = question.correct_answer;
    let wrongAnswerIndex = 0;
    return answers.map((answer, index) => {
      const isCorrectAnswer = answer === correctAnswer;
      let answerCSSClass = '';
      if (questionAnswered) {
        answerCSSClass = isCorrectAnswer ? 'correctAnswer' : 'wrongAnswer';
      }
      let dataTestid;
      if (isCorrectAnswer) dataTestid = 'correct-answer';
      else {
        dataTestid = `wrong-answer-${wrongAnswerIndex}`;
        wrongAnswerIndex += 1;
      }
      return (
        <button
          type="button"
          data-testid={ dataTestid }
          key={ index }
          className={ `answerButton ${answerCSSClass}` }
          onClick={ () => {
            clearInterval(this.intervalTimerID);
            this.setState({ questionAnswered: true });
            if (isCorrectAnswer) this.addPoints();
          } }
          disabled={ questionAnswered }
        >
          {decode(answer)}
        </button>
      );
    });
  }

  renderAnswers = () => {
    const { questions, currentQuestion } = this.state;
    if (currentQuestion < questions.length) {
      return (
        <section data-testid="answer-options" className="Answers">
          {
            this.generateAnswersButton()
          }
        </section>
      );
    }
  }

  goToNextQuestion = () => {
    const { questions, currentQuestion } = this.state;
    if ((currentQuestion + 1) < questions.length) {
      this.setState({
        questionAnswered: false,
        currentQuestion: currentQuestion + 1,
        answers: getAnswers(questions[currentQuestion + 1]),
      },
      () => {
        this.activateInterval();
      });
    } else {
      const { history } = this.props;
      history.push('/feedback');
    }
  }

  renderNextButton = () => {
    const { questionAnswered } = this.state;
    return questionAnswered
      ? (
        <button
          type="button"
          data-testid="btn-next"
          onClick={ this.goToNextQuestion }
        >
          Próximo
        </button>
      )
      : null;
  }

  renderTimer = () => {
    const { timer } = this.state;
    return (
      <div>{timer}</div>
    );
  }

  render() {
    const { image } = this.state;
    const { userName, currentScore } = this.props;
    return (
      <main className="Game">
        <div className="Content">
          <Header image={ image } name={ userName } score={ currentScore } />
          <div className="Questions">
            {this.renderQuestion()}
            <div className="Answers">
              {this.renderAnswers()}
            </div>
          </div>
          <div className="Timer">
            <span>Tempo:</span>
            <span>{this.renderTimer()}</span>
          </div>
          <div className="nextButton">
            {this.renderNextButton()}
          </div>
        </div>
      </main>
    );
  }
}

Game.propTypes = {
  userEmail: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  getToken: PropTypes.func.isRequired,
  updateScore: PropTypes.func.isRequired,
  updateCurrentScore: PropTypes.func.isRequired,
  updateAssertion: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
  currentScore: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  questionType: PropTypes.string.isRequired,
};

const mapStateToProps = (store) => ({
  userName: store.player.name,
  userEmail: store.player.gravatarEmail,
  token: store.token,
  score: store.player.score,
  currentScore: store.player.currentScore,
  assertions: store.player.assertions,
  category: store.settings.category,
  difficulty: store.settings.difficulty,
  questionType: store.settings.questionType,
});

const mapDispatchToProps = (dispatch) => ({
  getToken: () => dispatch(thunkToken()),
  updateScore: (score) => dispatch(saveScore(score)),
  updateCurrentScore: (currentScore) => dispatch(saveCurrentScore(currentScore)),
  updateAssertion: (assertion) => dispatch(saveAssertions(assertion)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
