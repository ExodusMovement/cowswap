/* eslint-disable react/display-name */
import AppMod from './AppMod'
import styled from 'styled-components/macro'
import { RedirectPathToSwapOnly, RedirectToSwap } from 'pages/Swap/redirects'
import { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Routes } from 'constants/routes'

import AnySwapAffectedUsers from 'pages/error/AnySwapAffectedUsers'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { version } from '@src/../package.json'
import { environmentName } from 'utils/environments'
import RedirectAnySwapAffectedUsers from 'pages/error/AnySwapAffectedUsers/RedirectAnySwapAffectedUsers'
import { SENTRY_IGNORED_GP_QUOTE_ERRORS } from 'api/gnosisProtocol/errors/QuoteError'
import { DUNE_DASHBOARD_LINK, DOCS_LINK, DISCORD_LINK, TWITTER_LINK } from 'constants/index'

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN
const SENTRY_TRACES_SAMPLE_RATE = process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE

const Swap = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "swap" */ 'pages/Swap'))
const PrivacyPolicy = lazy(() => import(/* webpackChunkName: "privacy_policy" */ 'pages/PrivacyPolicy'))
const CookiePolicy = lazy(() => import(/* webpackChunkName: "cookie_policy" */ 'pages/CookiePolicy'))
const TermsAndConditions = lazy(() => import(/* webpackChunkName: "terms" */ 'pages/TermsAndConditions'))
const About = lazy(() => import(/* webpackChunkName: "about" */ 'pages/About'))
const NotFound = lazy(() => import(/* webpackChunkName: "not_found" */ 'pages/error/NotFound'))
const CowRunner = lazy(() => import(/* webpackChunkName: "cow_runner" */ 'pages/games/CowRunner'))
const MevSlicer = lazy(() => import(/* webpackChunkName: "mev_slicer" */ 'pages/games/MevSlicer'))

// FAQ pages
const Faq = lazy(() => import(/* webpackChunkName: "faq" */ 'pages/Faq'))
const ProtocolFaq = lazy(() => import(/* webpackChunkName: "protocol_faq" */ 'pages/Faq/ProtocolFaq'))
const TokenFaq = lazy(() => import(/* webpackChunkName: "token_faq" */ 'pages/Faq/TokenFaq'))
const TradingFaq = lazy(() => import(/* webpackChunkName: "trading_faq" */ 'pages/Faq/TradingFaq'))
const AffiliateFaq = lazy(() => import(/* webpackChunkName: "affiliate_faq" */ 'pages/Faq/AffiliateFaq'))

// Account pages
const Account = lazy(() => import(/* webpackChunkName: "account" */ 'pages/Account'))
const TokensOverview = lazy(() => import(/* webpackChunkName: "tokens_overview" */ 'pages/Account/Tokens'))
// const TokenSingle = lazy(() => import(/* webpackChunkName: "token_single" */ 'pages/Account/Tokens/TokenSingle'))
// const Governance = lazy(() => import(/* webpackChunkName: "governance" */ 'pages/Account/Governance'))
// const Affiliate = lazy(() => import(/* webpackChunkName: "affiliate" */ 'pages/Account/Affiliate'))

if (SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    release: 'CowSwap@v' + version,
    environment: environmentName,
    ignoreErrors: [...SENTRY_IGNORED_GP_QUOTE_ERRORS],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE ? Number(SENTRY_TRACES_SAMPLE_RATE) : 1.0,
  })
}

export const Wrapper = styled(AppMod)``

export const BodyWrapper = styled.div<{ location: { pathname: string } }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 10vh;
  align-items: center;
  justify-content: center;
  flex: auto;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    padding-top: 5vh;
    align-items: flex-start;
  `}

  ${({ theme, location }) => theme.mediaWidth.upToMedium`
    padding: ${location.pathname === Routes.SWAP ? '0 0 16px' : '0 16px 16px'};
  `}
`

export const LoadingWrapper = styled.div`
  animation: blinker 2s linear infinite;

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

function createRedirectExternal(url: string) {
  return () => {
    window.location.replace(url)
    return null
  }
}

const Loading = <LoadingWrapper>Loading...</LoadingWrapper>

export default function App() {
  return (
    <>
      <RedirectAnySwapAffectedUsers />
      <Wrapper>
        <Suspense fallback={Loading}>
          <Switch>
            <Redirect from="/claim" to={Routes.ACCOUNT} />
            <Redirect from="/profile" to={Routes.ACCOUNT} />
            <Route exact strict path={Routes.SWAP} component={Swap} />
            <Route exact strict path={Routes.SWAP_OUTPUT_CURRENCY} component={RedirectToSwap} />
            <Route exact strict path={Routes.SEND} component={RedirectPathToSwapOnly} />
            <Route exact strict path={Routes.ABOUT} component={About} />
            <Route exact strict path={Routes.ACCOUNT} component={Account} />

            <Route exact strict path={Routes.ACCOUNT} component={Account} />
            <Route exact strict path={Routes.ACCOUNT_TOKENS} component={TokensOverview} />
            {/* <Route exact strict path={Routes.ACCOUNT_TOKENS_SINGLE} component={TokenSingle} /> */}
            {/* <Route exact strict path={Routes.ACCOUNT_GOVERNANCE} component={Governance} /> */}
            {/* <Route exact strict path={Routes.ACCOUNT_AFFILIATE} component={Affiliate} /> */}

            <Route exact path={Routes.FAQ} component={Faq} />
            <Route exact strict path={Routes.FAQ_PROTOCOL} component={ProtocolFaq} />
            <Route exact strict path={Routes.FAQ_TOKEN} component={TokenFaq} />
            <Route exact strict path={Routes.FAQ_TRADING} component={TradingFaq} />
            <Route exact strict path={Routes.FAQ_AFFILIATE} component={AffiliateFaq} />
            <Route exact strict path={Routes.PLAY_COWRUNNER} component={CowRunner} />
            <Route exact strict path={Routes.PLAY_MEVSLICER} component={MevSlicer} />
            <Route exact strict path={Routes.ANYSWAP_AFFECTED} component={AnySwapAffectedUsers} />
            <Route exact strict path={Routes.PRIVACY_POLICY} component={PrivacyPolicy} />
            <Route exact strict path={Routes.COOKIE_POLICY} component={CookiePolicy} />
            <Route exact strict path={Routes.TERMS_CONDITIONS} component={TermsAndConditions} />
            <Route exact strict path={Routes.CHAT} component={createRedirectExternal(DISCORD_LINK)} />
            <Route exact strict path={Routes.DOCS} component={createRedirectExternal(DOCS_LINK)} />
            <Route exact strict path={Routes.STATS} component={createRedirectExternal(DUNE_DASHBOARD_LINK)} />
            <Route exact strict path={Routes.TWITTER} component={createRedirectExternal(TWITTER_LINK)} />
            <Route exact strict path={Routes.HOME} component={RedirectPathToSwapOnly} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Wrapper>
    </>
  )
}
