import React, { Component, HTMLAttributes, RefObject } from 'react';
import FixedLayout from '../FixedLayout/FixedLayout';
import classNames from '../../lib/classNames';
import getClassName from '../../helpers/getClassName';
import { animationEvent } from '../../lib/supportEvents';
import withPlatform from '../../hoc/withPlatform';
import { HasPlatform } from '../../types';

export interface PanelHeaderContextProps extends HTMLAttributes<HTMLDivElement>, HasPlatform {
  opened: boolean;
  onClose: VoidFunction;
}

export interface PanelHeaderContextState {
  closing: boolean;
}

class PanelHeaderContext extends Component<PanelHeaderContextProps, PanelHeaderContextState> {
  static defaultProps: Partial<PanelHeaderContextProps> = {
    opened: false,
  };

  state: PanelHeaderContextState = {
    closing: false,
  };

  elementRef: RefObject<HTMLDivElement> = React.createRef();

  private animationFinishTimeout: ReturnType<typeof setTimeout>;

  componentDidUpdate(prevProps: PanelHeaderContextProps) {
    if (this.props.opened !== prevProps.opened) {
      if (this.props.opened === false) {
        this.setState({ closing: true });
        this.waitAnimationFinish(this.onAnimationFinish);
      }
    }
  }

  waitAnimationFinish(eventHandler: VoidFunction) {
    if (this.elementRef.current) {
      if (animationEvent.supported) {
        this.elementRef.current.removeEventListener(animationEvent.name, eventHandler);
        this.elementRef.current.addEventListener(animationEvent.name, eventHandler);
      } else {
        clearTimeout(this.animationFinishTimeout);
        this.animationFinishTimeout = setTimeout(eventHandler, 200);
      }
    }
  }

  onAnimationFinish: VoidFunction = () => {
    this.setState({ closing: false });
  };

  render() {
    const { children, className, opened, onClose, platform, ...restProps } = this.props;
    const { closing } = this.state;
    const baseClassNames = getClassName('PanelHeaderContext', platform);

    return (
      <FixedLayout {...restProps} className={classNames(baseClassNames, {
        'PanelHeaderContext--opened': opened,
        'PanelHeaderContext--closing': closing,
      }, className)} vertical="top">
        <div className="PanelHeaderContext__in" ref={this.elementRef}>
          {(opened || closing) && children}
        </div>
        {(opened || closing) && <div onClick={onClose} className="PanelHeaderContext__fade" />}
      </FixedLayout>
    );
  }
}

export default withPlatform(PanelHeaderContext);
