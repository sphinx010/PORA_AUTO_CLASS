describe('Login', () => {


 let yourData, myUserName, myPassword , loginButton , passwordField , usernameField
 beforeEach(()=>{
  cy.visit('/')
  cy.fixture('ourData').then((mydata)=>{
    yourData = mydata
    myUserName = mydata.username
    myPassword = mydata.password
    loginButton =  yourData.login_button
    passwordField = yourData.password_field
    usernameField = yourData.username_field
  }) 
 })

 it('VALIDATES THAT WEBSITE IS UP AND RUNNING', ()=>{
  //End TO End Test to confirm the backend login requested was successful
  cy.url().should('include', '/login')
  cy.get('.orangehrm-login-forgot > .oxd-text').contains('Forgot your password?')
  .should('be.visible')
 })

 it('Performs successful login',()=>{
  //get username field and type admin
  cy.get(usernameField).type(myUserName)
  cy.get(passwordField).type(myPassword)
  cy.contains('.oxd-button',loginButton).click({timeout: 10000})
  cy.url().should('include', '/dashboard')
 })

})
describe('sign-up',()=>{

})

/*describe('Forgot password', () => {
 beforeEach(()=>{
  cy.visit('/')
 })
})
*/




describe 
//brackets
(

//TEST SUITE NAME (Feature under test)
''
,

//ARROW FUNCTION
()=>{

  //THIS IS WHERE YOUR TEST SCRIPTS FOR THAT FEATURE WILL RUN
}
)