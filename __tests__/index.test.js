import React, { Fragment } from 'react';
import { mount } from 'enzyme';
import MediaManager, { MediaConsumer, MediaCondition, MediaSlot } from '../src';

const queries = {
  small: '(max-width: 599px)',
  medium: '(min-width: 600px) and (max-width: 1023px)',
  large: '(min-width: 1024px)',
  screen: 'only screen'
};

const matchMedia = match => query => {
  return {
    matches: query === match || query === queries.screen,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  };
};

describe('<MediaManager />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('window.matchMedia', () => {
    test('setup - event listeners and intial state', () => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries['small']));
      const wrapper = mount(<MediaManager queries={queries} />);

      expect(window.matchMedia.mock.calls.length).toBe(4);
      expect(window.matchMedia.mock.calls[0][0]).toBe(queries.small);
      expect(window.matchMedia.mock.calls[1][0]).toBe(queries.medium);
      expect(window.matchMedia.mock.calls[2][0]).toBe(queries.large);
      expect(window.matchMedia.mock.calls[3][0]).toBe(queries.screen);

      expect(window.matchMedia.mock.results[0].value.matches).toBe(true);
      expect(window.matchMedia.mock.results[1].value.matches).toBe(false);
      expect(window.matchMedia.mock.results[2].value.matches).toBe(false);
      expect(window.matchMedia.mock.results[3].value.matches).toBe(true);

      expect(window.matchMedia.mock.results[0].value.media).toBe(queries.small);
      expect(window.matchMedia.mock.results[1].value.media).toBe(queries.medium);
      expect(window.matchMedia.mock.results[2].value.media).toBe(queries.large);
      expect(window.matchMedia.mock.results[3].value.media).toBe(queries.screen);

      expect(window.matchMedia.mock.results[0].value.addListener).toHaveBeenCalled();
      expect(window.matchMedia.mock.results[1].value.addListener).toHaveBeenCalled();
      expect(window.matchMedia.mock.results[2].value.addListener).toHaveBeenCalled();
      expect(window.matchMedia.mock.results[3].value.addListener).toHaveBeenCalled();

      expect(window.matchMedia.mock.results[0].value.removeListener).not.toHaveBeenCalled();
      expect(window.matchMedia.mock.results[1].value.removeListener).not.toHaveBeenCalled();
      expect(window.matchMedia.mock.results[2].value.removeListener).not.toHaveBeenCalled();
      expect(window.matchMedia.mock.results[3].value.removeListener).not.toHaveBeenCalled();

      expect(wrapper.state()).toEqual({ small: true, medium: false, large: false, screen: true });
    });

    describe('media query list events', () => {
      const scenarios = [
        ['trigger small', true, false, false, true],
        ['trigger medium', false, true, false, true],
        ['trigger large', false, false, true, true],
        ['trigger screen', false, false, false, false]
      ];

      test.each(scenarios)('%s', (scenario, small, medium, large, screen) => {
        window.matchMedia = jest.fn().mockImplementation(matchMedia(queries['small']));
        const wrapper = mount(<MediaManager queries={queries} />);

        const smallCallback = window.matchMedia.mock.results[0].value.addListener.mock.calls[0][0];
        const mediumCallback = window.matchMedia.mock.results[1].value.addListener.mock.calls[0][0];
        const largeCallback = window.matchMedia.mock.results[2].value.addListener.mock.calls[0][0];
        const screenCallback = window.matchMedia.mock.results[3].value.addListener.mock.calls[0][0];

        smallCallback({ matches: small });
        mediumCallback({ matches: medium });
        largeCallback({ matches: large });
        screenCallback({ matches: screen });

        wrapper.update();
        expect(wrapper.state()).toEqual({ small, medium, large, screen });
      });
    });

    test('teardown - remove event listeners', () => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries['small']));
      const Wrapped = ({ isUsed }) => <div>{isUsed && <MediaManager queries={queries} />}</div>;
      const wrapper = mount(<Wrapped isUsed={true} />);
      expect(wrapper.find(MediaManager).exists()).toBe(true);

      wrapper.setProps({ isUsed: false });
      expect(wrapper.find(MediaManager).exists()).toBe(false);

      const smallMock = window.matchMedia.mock.results[0].value;
      const mediumMock = window.matchMedia.mock.results[1].value;
      const largeMock = window.matchMedia.mock.results[2].value;
      const screenMock = window.matchMedia.mock.results[3].value;

      expect(smallMock.removeListener.mock.calls[0][0]).toBe(smallMock.addListener.mock.calls[0][0]);
      expect(mediumMock.removeListener.mock.calls[0][0]).toBe(mediumMock.addListener.mock.calls[0][0]);
      expect(largeMock.removeListener.mock.calls[0][0]).toBe(largeMock.addListener.mock.calls[0][0]);
      expect(screenMock.removeListener.mock.calls[0][0]).toBe(screenMock.addListener.mock.calls[0][0]);
    });
  });
});

describe('<MediaConsumer />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('slot', () => {
    const scenarios = [
      ['small', true, false, false],
      ['medium', false, true, true],
      ['large', false, true, true],
      ['screen', false, false, false]
    ];

    test.each(scenarios)('%s', (queryKey, small, medium, large) => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries[queryKey]));

      const wrapper = mount(
        <MediaManager queries={queries}>
          <div>
            <MediaConsumer>
              {({ small, medium, large, screen }) => (
                <Fragment>
                  {small && <div id="small" />}
                  {(medium || large) && (
                    <Fragment>
                      <div id="medium" />
                      <div id="large" />
                    </Fragment>
                  )}
                  {screen && <div id="screen" />}
                </Fragment>
              )}
            </MediaConsumer>
          </div>
        </MediaManager>
      );

      expect(wrapper.find('#small').exists()).toBe(small);
      expect(wrapper.find('#medium').exists()).toBe(medium);
      expect(wrapper.find('#large').exists()).toBe(large);
      expect(wrapper.find('#screen').exists()).toBe(true);
    });
  });
});

describe('<MediaSlot />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('slot', () => {
    const scenarios = [
      ['small', true, false, false],
      ['medium', false, true, false],
      ['large', false, false, true],
      ['screen', false, false, false]
    ];

    test.each(scenarios)('%s', (queryKey, small, medium, large) => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries[queryKey]));

      const wrapper = mount(
        <MediaManager queries={queries}>
          <div>
            <MediaSlot
              small={key => <div id="small" key={key} />}
              medium={key => <div id="medium" key={key} />}
              large={key => <div id="large" key={key} />}
              screen={key => <div id="screen" key={key} />}
            />
          </div>
        </MediaManager>
      );

      expect(wrapper.state()).toEqual({ small, medium, large, screen: true });
      expect(wrapper.find('#small').exists()).toBe(small);
      expect(wrapper.find('#medium').exists()).toBe(medium);
      expect(wrapper.find('#large').exists()).toBe(large);
      expect(wrapper.find('#screen').exists()).toBe(true);
    });
  });
});

describe('<MediaCondition />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('is', () => {
    const scenarios = [
      ['small', true, false, false],
      ['medium', false, true, false],
      ['large', false, false, true],
      ['screen', false, false, false]
    ];

    test.each(scenarios)('%s', (queryKey, small, medium, large) => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries[queryKey]));

      const wrapper = mount(
        <MediaManager queries={queries}>
          <div>
            <MediaCondition is="small">
              <div id="small" />
            </MediaCondition>
            <MediaCondition is="medium">
              <div id="medium" />
            </MediaCondition>
            <MediaCondition is="large">
              <div id="large" />
            </MediaCondition>
            <MediaCondition is="screen">
              <div id="screen" />
            </MediaCondition>
          </div>
        </MediaManager>
      );

      expect(wrapper.state()).toEqual({ small, medium, large, screen: true });
      expect(wrapper.find('#small').exists()).toBe(small);
      expect(wrapper.find('#medium').exists()).toBe(medium);
      expect(wrapper.find('#large').exists()).toBe(large);
      expect(wrapper.find('#screen').exists()).toBe(true);
    });
  });

  describe('not', () => {
    const scenarios = [
      ['small', false, true, true],
      ['medium', true, false, true],
      ['large', true, true, false],
      ['screen', true, true, true]
    ];

    test.each(scenarios)('%s', (queryKey, small, medium, large) => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries[queryKey]));

      const wrapper = mount(
        <MediaManager queries={queries}>
          <div>
            <MediaCondition not="small">
              <div id="not-small" />
            </MediaCondition>
            <MediaCondition not="medium">
              <div id="not-medium" />
            </MediaCondition>
            <MediaCondition not="large">
              <div id="not-large" />
            </MediaCondition>
            <MediaCondition not="screen">
              <div id="not-screen" />
            </MediaCondition>
          </div>
        </MediaManager>
      );

      expect(wrapper.state()).toEqual({ small: !small, medium: !medium, large: !large, screen: true });
      expect(wrapper.find('#not-small').exists()).toBe(small);
      expect(wrapper.find('#not-medium').exists()).toBe(medium);
      expect(wrapper.find('#not-large').exists()).toBe(large);
      expect(wrapper.find('#not-screen').exists()).toBe(false);
    });
  });

  describe('anyOf', () => {
    const scenarios = [['small', 2, 1, 1], ['medium', 1, 2, 1], ['large', 1, 1, 2], ['screen', 0, 0, 0]];
    test.each(scenarios)('%s', (queryKey, smallCount, mediumCount, largeCount) => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries[queryKey]));

      const wrapper = mount(
        <MediaManager queries={queries}>
          <div>
            <MediaCondition anyOf={['small', 'medium']}>
              <div className="small medium child" />
            </MediaCondition>
            <MediaCondition anyOf={['small', 'large']}>
              <div className="small large child" />
            </MediaCondition>
            <MediaCondition anyOf={['medium', 'large']}>
              <div className="medium large child" />
            </MediaCondition>
          </div>
        </MediaManager>
      );

      expect(wrapper.find('.small')).toHaveLength(smallCount);
      expect(wrapper.find('.medium')).toHaveLength(mediumCount);
      expect(wrapper.find('.large')).toHaveLength(largeCount);
      expect(wrapper.find('.screen')).toHaveLength(0);
    });
  });

  describe('noneOf', () => {
    const scenarios = [['small', 1, 0, 0], ['medium', 0, 1, 0], ['large', 0, 0, 1], ['screen', 1, 1, 1]];

    test.each(scenarios)('%s', (queryKey, smallCount, mediumCount, largeCount) => {
      window.matchMedia = jest.fn().mockImplementation(matchMedia(queries[queryKey]));

      const wrapper = mount(
        <MediaManager queries={queries}>
          <div>
            <MediaCondition noneOf={['medium', 'large']}>
              <div id="small" />
            </MediaCondition>
            <MediaCondition noneOf={['small', 'large']}>
              <div id="medium" />
            </MediaCondition>
            <MediaCondition noneOf={['small', 'medium']}>
              <div id="large" />
            </MediaCondition>
          </div>
        </MediaManager>
      );

      expect(wrapper.find('#small')).toHaveLength(smallCount);
      expect(wrapper.find('#medium')).toHaveLength(mediumCount);
      expect(wrapper.find('#large')).toHaveLength(largeCount);
      expect(wrapper.find('#screen')).toHaveLength(0);
    });
  });
});
