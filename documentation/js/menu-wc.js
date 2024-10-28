'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">password-app documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdminComponent.html" data-type="entity-link" >AdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ApiDocsComponent.html" data-type="entity-link" >ApiDocsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BillingDetailsComponent.html" data-type="entity-link" >BillingDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CardComponent.html" data-type="entity-link" >CardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateFolderDialogComponent.html" data-type="entity-link" >CreateFolderDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreditCardFormComponent.html" data-type="entity-link" >CreditCardFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DownloadComponent.html" data-type="entity-link" >DownloadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditProfileComponent.html" data-type="entity-link" >EditProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileExplorerComponent.html" data-type="entity-link" >FileExplorerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileUploadComponent.html" data-type="entity-link" >FileUploadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent-1.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IdProofComponent.html" data-type="entity-link" >IdProofComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IdproofformComponent.html" data-type="entity-link" >IdproofformComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IndexComponent.html" data-type="entity-link" >IndexComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvitationAcceptComponent.html" data-type="entity-link" >InvitationAcceptComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MfaSettingComponent.html" data-type="entity-link" >MfaSettingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MfaVerificationComponent.html" data-type="entity-link" >MfaVerificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotesComponent.html" data-type="entity-link" >NotesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotesFormComponent.html" data-type="entity-link" >NotesFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationComponent.html" data-type="entity-link" >NotificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationComponent.html" data-type="entity-link" >OrganizationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationsComponent.html" data-type="entity-link" >OrganizationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordChangeComponent.html" data-type="entity-link" >PasswordChangeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordChangeComponent-1.html" data-type="entity-link" >PasswordChangeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordComponent.html" data-type="entity-link" >PasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordFormComponent.html" data-type="entity-link" >PasswordFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordGenratorComponent.html" data-type="entity-link" >PasswordGenratorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordStrengthComponent.html" data-type="entity-link" >PasswordStrengthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PricingPageComponent.html" data-type="entity-link" >PricingPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrivacyPolicyComponent.html" data-type="entity-link" >PrivacyPolicyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RolesPermissionsComponent.html" data-type="entity-link" >RolesPermissionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SecurityComponent.html" data-type="entity-link" >SecurityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ShareDialogComponent.html" data-type="entity-link" >ShareDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SideNavComponent.html" data-type="entity-link" >SideNavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignupComponent.html" data-type="entity-link" >SignupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SupportComponent.html" data-type="entity-link" >SupportComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TagFormCompoent.html" data-type="entity-link" >TagFormCompoent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserFormComponent.html" data-type="entity-link" >UserFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserProfileComponent.html" data-type="entity-link" >UserProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UsersComponent.html" data-type="entity-link" >UsersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/viewCardDetailsComponent.html" data-type="entity-link" >viewCardDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewNoteCompoent.html" data-type="entity-link" >ViewNoteCompoent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewPasswordComponent.html" data-type="entity-link" >ViewPasswordComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CardService.html" data-type="entity-link" >CardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link" >CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link" >FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FolderService.html" data-type="entity-link" >FolderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NoteService.html" data-type="entity-link" >NoteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganizationService.html" data-type="entity-link" >OrganizationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordService.html" data-type="entity-link" >PasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlanService.html" data-type="entity-link" >PlanService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProofIdService.html" data-type="entity-link" >ProofIdService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RolesPermissionsService.html" data-type="entity-link" >RolesPermissionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecurityQuestionService.html" data-type="entity-link" >SecurityQuestionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SharedItemService.html" data-type="entity-link" >SharedItemService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Folder.html" data-type="entity-link" >Folder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IdProof.html" data-type="entity-link" >IdProof</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Window.html" data-type="entity-link" >Window</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});