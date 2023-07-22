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



function App() {
  return (
    <>
      <Toaster />


      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />}></Route>
          <Route path='/register' element={<Register />} />
          <Route path="/wizard" element={<Wizard />} />


          {/* ROUTES PRIVATE IN APP */}

          <Route path="/home" element={<Global Element={function () { }} />} />
          <Route path="/campaigns" element={<Global Element={MyCampaigns} />} />
          <Route path="/campaigns/new" element={<Global Element={MyCampaigns} />} />
          <Route path="/campaigns/detail/:id" element={<Global Element={DetailCampaigns} />} />
          <Route path="/companys" element={<Global Element={MyCompanys} />} />
          <Route path="/companys/roles" element={<Global Element={RolsCompany} />} />
          <Route path="/companys/users" element={<Global Element={UsersCompany} />} />


          {/* LISTASD */}

          <Route path="/contacts/lists" element={<Global Element={Lists} />} />
          <Route path="/contacts/detail/:id" element={<Global Element={DetailLists} />} />
          <Route path="/contacts/upload/:id" element={<Global Element={UploadContacts} />} />


          {/*EDITOR CANVAS*/}
          <Route path="/editor/canvas/:id" element={<Global Element={EditorCanvas} />} />
          <Route path="/editor/canvas/" element={<Global Element={EditorCanvas} />} />


          {/* SURVEYS */}
          <Route path="/surveys" element={<Global Element={MySurveys} />} />
          <Route path="/surveys/editor" element={<Global Element={SurveysEditor} />} />
          <Route path="/surveys/editor/:idsurvey" element={<Global Element={SurveysEditor} />} />
          <Route path='/stats/survey/:id' element={<Global Element={StatsSurvey} />} />
          <Route path='/stats/survey/:id/detail' element={<Global Element={DetailSurvey} />} />
          <Route path='/stats/survey/:id/response' element={<Global Element={ResponseSurvey} />} />
          <Route path="/surveys/preview" element={<PreviewSurvey />} />
          <Route path="/surveys/preview/:id" element={<PreviewSurvey />} />
          <Route path="/survey/:id" element={<ViewSurvey />} />


          {/* SHORTURLS */}


          <Route path="/shorturls" element={<Global Element={MyShortUrls} />} />
          <Route path='/shorturls/:id' element={<Global Element={DetailShortUrl} />} />



        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
