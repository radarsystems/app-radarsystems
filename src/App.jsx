import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import { Auth } from './Pages/Auth'
import "./Styles/css/app.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Toaster } from 'react-hot-toast'
import Register from './Pages/Register'
import Wizard from './Pages/Wizard'
import Global from './Pages/Global'
import MyCampaigns from './Pages/App/Campaigns/MyCampaigns'
import MyCompanys from './Pages/App/Companys/MyCompanys'
import RolsCompany from './Pages/App/Companys/RolsCompany'
import UsersCompany from './Pages/App/Companys/UsersCompany'
import DetailCampaigns from './Pages/App/Campaigns/DetailCampaigns'
import Lists from './Pages/App/Contacts/Lists'
import DetailLists from './Pages/App/Contacts/DetailLists'
import UploadContacts from './Pages/App/Contacts/UploadContacts'
import EditorCanvas from './Components/App/Editor/Canvas'
import MySurveys from './Pages/App/Surveys/MySurveys'
import SurveysEditor from './Pages/App/Surveys/SurveysEditor'
import PreviewSurvey from './Pages/App/Surveys/PreviewSurvey'
import ViewSurvey from './Pages/App/Surveys/Survey'
import StatsSurvey from './Pages/App/Stats/StatsSurvey'
import DetailSurvey from './Pages/App/Stats/DetailSurvey'
import ResponseSurvey from './Pages/App/Surveys/ResponseSurvey'
import MyShortUrls from './Pages/App/ShortUrl/MyShortUrls'
import DetailShortUrl from './Pages/App/ShortUrl/DetailShortUrl'
import Test from './Pages/App/Test'
import CampaignsUrl from './Pages/App/ShortUrl/CampaignsUrl'
import StatsCampaignShort from './Pages/App/ShortUrl/StatsCampaignShort'
import MyQr from './Pages/App/Qr/MyQr'
import ButtonsEditor from './Pages/App/Buttons/ButtonsEditor'
import ButtonsBody from './Pages/App/Buttons/Buttons'
import ButtonsQrEditor from './Pages/App/ButtonsQr/ButtonsQrEditor'
import Recovery from './Pages/App/Recovery'
import MyContacts from './Pages/App/Contacts/MyContacts'
import LandingEditor from './Pages/App/Landings/LandingEditor'
import MyLandings from './Pages/App/Landings/MyLandings'
import Landing from './Pages/App/Landings/Landing'
import MyButtons from './Pages/App/Buttons/MyButtons'
import MyButtonsQr from './Pages/App/ButtonsQr/MyButtonsQr'
import ButtonsQr from './Pages/App/ButtonsQr/ButtonsQr'
import ButtonsStats from './Pages/App/Buttons/ButtonsStats'
import StatsCampaigns from './Pages/App/Campaigns/StatsCampaigns'
import MySegments from './Pages/App/Contacts/MySegments'
import MyDomains from './Pages/App/Domains/MyDomains'
import AddSegments from './Pages/App/Contacts/AddSegments'
import Home from './Pages/App/Home/Home'
import StatsDetailCampaigns from './Pages/App/Campaigns/StatsDetailCampaigns'
import Templates from './Pages/App/Templates/Templates'
import CompanyAccount from './Pages/App/SettingsAccount/Account'
import "./Functions/Jquery.js"
import CompanyDomains from './Pages/App/SettingsAccount/Domains'
import LogsList from './Pages/App/Contacts/LogsList.jsx'
import WizardQr from './Components/App/Qr/WizardQr.jsx'
import PreviewIphone from './Components/App/Preview/Iphone.jsx'
import { Logout } from './Pages/App/Logout.jsx'
import { useContext } from 'react'
import { AuthContext } from './Context/AuthContext.jsx'
import DomainWatch from './Pages/App/SettingsAccount/Domain.jsx'
import PlansCompany from './Pages/App/Companys/PlansCompany.jsx'
import CheckOut from './Pages/App/Checkout/CheckOut.jsx'
import Credentials from './Pages/App/Companys/Credentials.jsx'
import CheckOutCheck from './Pages/App/Checkout/CheckOutCheck.jsx'
import ContactsList from './Pages/App/Contacts/ContactsList.jsx'



function App() {

  const { LoadingAuth } = useContext(AuthContext)

  return (
    <>
      <Toaster />

      {LoadingAuth ? <>
        <div className="loading-template">
          <div className="center">
            <img src="/img/icons/logo.png" alt="" />
            <p className="await">Cargando... <div className="loading"></div></p>
          </div>
        </div>
      </> :
        <>

        </>
      }


      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />}></Route>
          <Route path='/register' element={<Register />} />
          <Route path="/wizard" element={<Wizard />} />

          {/* SETTINGS */}
          <Route path="/settings-account/account" element={<Global CompanyNeed={true} Element={CompanyAccount} />} />
          <Route path="/settings-account/security" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/settings-account/footer" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/settings-account/domains" element={<Global CompanyNeed={true} Element={CompanyDomains} />} />
          <Route path="/settings-account/domain/:id" element={<Global CompanyNeed={true} Element={DomainWatch} />} />
          <Route path="/settings-account/credentials" element={<Global CompanyNeed={true} Element={Credentials} />} />


          {/* ROUTES PRIVATE IN APP */}
          <Route path="/" element={<Global CompanyNeed={true} Element={Home} />} />
          <Route path="/home" element={<Global CompanyNeed={true} Element={Home} />} />
          <Route path="/campaigns" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/campaigns/em" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/campaigns/sms" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/campaigns/sms-mt" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/campaigns/em-mt" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />

          <Route path="/campaigns/new" element={<Global CompanyNeed={true} Element={MyCampaigns} />} />
          <Route path="/campaigns/stats/:id" element={<Global CompanyNeed={true} Element={StatsCampaigns} />} />
          <Route path="/campaigns/stats/detail/:id" element={<Global CompanyNeed={true} Element={StatsDetailCampaigns} />} />
          <Route path="/campaigns/detail/:id" element={<Global CompanyNeed={true} Element={DetailCampaigns} />} />
          <Route path="/companys" element={<Global CompanyNeed={false} Element={MyCompanys} />} />
          <Route path="/companys/add" element={<Global CompanyNeed={false} Element={MyCompanys} />} />
          <Route path="/companys/roles" element={<Global CompanyNeed={true} Element={RolsCompany} />} />
          <Route path="/companys/users" element={<Global CompanyNeed={true} Element={UsersCompany} />} />
          <Route path="/companys/plans" element={<Global CompanyNeed={true} Element={PlansCompany} />} />
          <Route path="/checkout/:id" element={<Global CompanyNeed={true} Element={CheckOut} />} />
          <Route path="/checkout/check" element={<Global CompanyNeed={true} Element={CheckOutCheck} />} />


          {/* LISTASD */}

          <Route path="/contacts/lists" element={<Global CompanyNeed={true} Element={Lists} />} />
          <Route path="/contacts/lists/add" element={<Global CompanyNeed={true} Element={Lists} />} />
          <Route path="/contacts/lists/logs/:id" element={<Global CompanyNeed={true} Element={LogsList} />} />
          <Route path="/contacts/lists/contacts/:id" element={<Global CompanyNeed={true} Element={ContactsList} />} />
          <Route path="/contacts/lists/:type" element={<Global CompanyNeed={true} Element={Lists} />} />
          <Route path="/contacts/detail/:id" element={<Global CompanyNeed={true} Element={DetailLists} />} />
          <Route path="/contacts/upload/:id" element={<Global CompanyNeed={true} Element={UploadContacts} />} />
          <Route path="/contacts/segments" element={<Global CompanyNeed={true} Element={MySegments} />} />
          <Route path="/contacts/segments/add" element={<Global CompanyNeed={true} Element={AddSegments} />} />
          <Route path="/contacts" element={<Global CompanyNeed={true} Element={MyContacts} />} />


          {/*EDITOR CANVAS*/}
          <Route path="/editor/canvas/:id" element={<Global CompanyNeed={true} Element={EditorCanvas} />} />
          <Route path="/editor/canvas/" element={<Global CompanyNeed={true} Element={EditorCanvas} />} />


          {/* SURVEYS */}
          <Route path="/surveys" element={<Global CompanyNeed={true} Element={MySurveys} />} />
          <Route path="/surveys/editor" element={<Global CompanyNeed={true} Element={SurveysEditor} />} />
          <Route path="/surveys/editor/:idsurvey" element={<Global CompanyNeed={true} Element={SurveysEditor} />} />
          <Route path='/stats/survey/:id' element={<Global CompanyNeed={true} Element={StatsSurvey} />} />
          <Route path='/stats/survey/:id/detail' element={<Global CompanyNeed={true} Element={DetailSurvey} />} />
          <Route path='/stats/survey/:id/response' element={<Global CompanyNeed={true} Element={ResponseSurvey} />} />
          <Route path="/surveys/preview" element={<PreviewSurvey />} />
          <Route path="/surveys/preview/:id" element={<PreviewSurvey />} />
          <Route path="/survey/:id" element={<ViewSurvey />} />


          {/* SHORTURLS */}


          <Route path="/shorturls" element={<Global CompanyNeed={true} Element={MyShortUrls} />} />
          <Route path="/shorturls/add" element={<Global CompanyNeed={true} Element={MyShortUrls} />} />
          <Route path='/shorturls/:id' element={<Global CompanyNeed={true} Element={DetailShortUrl} />} />
          <Route path='/shorturls/campaigns' element={<Global CompanyNeed={true} Element={CampaignsUrl} />} />
          <Route path='/shorturls/campaigns/add' element={<Global CompanyNeed={true} Element={CampaignsUrl} />} />
          <Route path='/shorturls/campaigns/:id' element={<Global CompanyNeed={true} Element={StatsCampaignShort} />} />

          {/* MY QRS */}
          <Route path='/qr' element={<Global CompanyNeed={true} Element={MyQr} />} />
          <Route path='/qr/add' element={<Global CompanyNeed={true} Element={MyQr} />} />
          <Route path='/qr/import' element={<Global CompanyNeed={true} Element={MyQr} />} />



          {/* MY DOMAINS */}
          <Route path='/domains' element={<Global CompanyNeed={true} Element={MyDomains} />} />


          {/* MY BUTTONS */}

          <Route path='/editor/buttons' element={<Global CompanyNeed={true} Element={ButtonsEditor} />} />
          <Route path='/editor/buttons/:id' element={<Global CompanyNeed={true} Element={ButtonsEditor} />} />
          <Route path='/buttons/:id' element={<ButtonsBody />} />
          <Route path='/buttons' element={<Global CompanyNeed={true} Element={MyButtons} />} />
          <Route path='/stats/buttons/:id' element={<Global CompanyNeed={true} Element={ButtonsStats} />} />


          {/* MY BUTTONS QR*/}
          <Route path='/editor/buttonsqr' element={<Global CompanyNeed={true} Element={ButtonsQrEditor} />} />
          <Route path='/editor/buttonsqr/:id' element={<Global CompanyNeed={true} Element={ButtonsQrEditor} />} />
          <Route path='/buttonsqr' element={<Global CompanyNeed={true} Element={MyButtonsQr} />} />
          <Route path='/buttonsqr/:id' element={<ButtonsQr />} />

          {/* TEST PAGE*/}
          <Route path='/test' element={<Test />} />
          <Route path='/testiphone' element={<PreviewIphone />} />
          {/* RECOVERY */}
          <Route path='/recovery' element={<Recovery />} />

          {/* LANDINGS WEB */}
          <Route path='/editor/landings' element={<LandingEditor />} />
          <Route path='/landings' element={<Global CompanyNeed={true} Element={MyLandings} />} />
          <Route path='/landing/:id' element={<Landing />} />

          {/* TEMPLATES */}
          <Route path="/templates" element={<Global CompanyNeed={true} Element={Templates} />} />



          {/* LOGOUT */}

          <Route path={`/logout`} element={<Logout />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
