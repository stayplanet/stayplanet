import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController, ModalController, ViewController, LoadingController } from 'ionic-angular';

import {Md5} from 'ts-md5/dist/md5';

import { DatabaseService } from '../../services/databaseService';
import { UserService } from '../../services/userService';

@Component({
	selector: 'signupPage',
	templateUrl: 'signupPage.html',
})
export class SignupPage {

	@ViewChild(Slides) slides: Slides;

	name: string = '';
	surname: string = '';
	email: string;
	password: string = '';
	confirmPassword: string = '';

	membershipType: string;
	countries: any[];
	country: string;
	regions: any[];
	region: string;
	cities: any[];
	city: string;
	postCode: string = '';
	address: string = '';
	captchaCode: string = '';
	userCaptchaCode: string = '';
	informAboutLatestNews: boolean = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private loadingController: LoadingController,
		private toastController: ToastController,
		private modalController: ModalController,
		private databaseService: DatabaseService,
		private userService: UserService
	) {
	}

	ionViewDidLoad() {
		this.databaseService.getCountries().subscribe(countries => {
			this.countries = countries;
		});
		this.slides.lockSwipes(true);
	}

	continueSignUp() {
		if (this.name.length < 1) {
			let toast = this.toastController.create({
				message: 'You must provide a name',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.surname.length < 1) {
			let toast = this.toastController.create({
				message: 'You must provide a surname',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!regExp.test(this.email)) {
			let toast = this.toastController.create({
				message: 'You must insert a valid email address',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.password != this.confirmPassword) {
			let toast = this.toastController.create({
				message: 'Passwords must be the same',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.password.length < 6) {
			let toast = this.toastController.create({
				message: 'Password must contain more than 5 characters',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.password.search(/\d/) == -1) {
			let toast = this.toastController.create({
				message: 'Password must contain at least one number',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.password.search(/[a-zA-Z]/) == -1) {
			let toast = this.toastController.create({
				message: 'Password must contain at least one letter',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		this.captchaCode = '';
		this.userCaptchaCode = '';
		let font = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (var i = 0; i < 5; i++) {
			this.captchaCode += font.charAt(Math.floor(Math.random() * font.length));
		}

		this.userService.compareEmail(this.email).subscribe(exist => {
			if(!exist){
				this.slides.lockSwipes(false);
				this.slides.slideNext();
				this.slides.lockSwipes(true);
			}else{
				let toast = this.toastController.create({
					message: 'Email already in use',
					duration: 1500,
					position: 'bottom'
				});
				toast.present();
				return false;
			}
		});
	}

	getCountryRegions() {
		this.databaseService.getCountryRegions(this.country).subscribe(regions => {
			this.regions = regions;
		});
	}

	openTaCModel() {
		let checkInModal = this.modalController.create(TermsAndConditions);
		checkInModal.present();
	}
	openPPModel() {
		let checkInModal = this.modalController.create(PrivacyPolicy);
		checkInModal.present();
	}

	goBack() {
		this.slides.lockSwipes(false);
		this.slides.slidePrev();
		this.slides.lockSwipes(true);
	}
	signUp() {
		if (!this.country) {
			let toast = this.toastController.create({
				message: 'Please select your country',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (!this.region) {
			let toast = this.toastController.create({
				message: 'Please select your region',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (!this.city) {
			let toast = this.toastController.create({
				message: 'Please provide your city',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		if (this.postCode == '') {
			let toast = this.toastController.create({
				message: 'Please provide a post code',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		if (this.address == '') {
			let toast = this.toastController.create({
				message: 'Please provide an address',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		if (this.captchaCode != this.userCaptchaCode) {
			let toast = this.toastController.create({
				message: 'Wrong code',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		let loader = this.loadingController.create({
			content: 'Please wait...',
			spinner: 'bubbles',
			cssClass: 'loadingController'
		});

		loader.present().then(() => {
			this.databaseService.compareCityName(this.city, this.region).subscribe(data => {
				loader.dismiss();
				if (data.exist) {
					this.userService.signup(
						this.name,this.surname, this.email, Md5.hashStr(this.password),
						this.membershipType, this.country, this.region, this.city, this.postCode, this.address, this.informAboutLatestNews
					).subscribe(data => {
						if(data){
							this.navCtrl.popToRoot();
						}						
					});
				} else {
					let toast = this.toastController.create({
						message: 'Not a valid city...',
						duration: 1500,
						position: 'bottom'
					});
					toast.present();
					return false;
				}
			});
		});

	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}

@Component({
	template: `
	<ion-header>
		<ion-toolbar>
				<ion-title><ion-icon ios="ios-clipboard" md="md-clipboard"></ion-icon> Terms and Conditions</ion-title>
				<ion-buttons start>
					<button ion-button (click)="dismiss()">
						<span ion-text color="primary" showWhen="ios">Cancel</span>
						<ion-icon name="md-close" showWhen="android,windows"></ion-icon>
					</button>
				</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content padding>
		<div class="middle_section" id="content_text">
			<h1>Terms and Conditions</h1>
			<div id="container-wrapper">
					<div class="container ">
							<div class="main3">
									<div id="content_text" class="middle_section">
											<p style="text-align: justify;">StayPlanet (hereafter referred to as "<strong>StayPlanet</strong>", "<strong>we</strong>", "<strong>us</strong>",
													or "<strong>our</strong>") provides an online platform that connects hosts who have accommodation
													to rent with guests seeking to rent such accommodation (collectively, the &ldquo;<strong>services</strong>&rdquo;),
													which Services are accessible at&nbsp;<a href="http://www.stayplanet.com">http://www.stayplanet.com</a>&nbsp;and
													any other websites through which StayPlanet makes the Services available (collectively, the &ldquo;site&rdquo;)
													and as an application for mobile devices (the &ldquo;<strong>application</strong>&rdquo;). By
													using the Site and Application, you agree to comply with and be legally bound by the terms and
													conditions of these Terms of Service ("<strong>Terms</strong>"), whether or not you become a
													registered user of the Services.
											</p>
											<p style="text-align: justify;">These Terms govern your access to and use of the Site, Application and Services and all Collective
													Content (defined below), and your participation in the Referral Program (defined below), and
													constitute a binding legal agreement between you and StayPlanet. Failure to use the Site and
													Application in accordance with these Terms may subject you to civil and criminal penalties.<br
													/>The site, application and services comprise an online platform through which hosts (defined
													below) may create listings (defined below) for accommodations (defined below) and guests (defined
													below) may learn about and book accommodations. You understand and agree that Stayplanet is not
													a party to any agreements entered into between hosts and guests, nor is Stayplanet a real estate
													broker, agent or insurer. Stayplanet has no control over the conduct of hosts, guests and other
													users of the site, application and services or any accommodations, and disclaims all liability
													in this regard.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>Key Terms</strong></p>
											<p style="text-align: justify;"><strong>&nbsp;</strong>&ldquo;<strong>StayPlanet Content</strong>&rdquo; means all content that StayPlanet
													makes available through the Site, Application, or Services, including any content licensed from
													a third party, but excluding Member Content.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Collective Content</strong>&rdquo; means member content and StayPlanet content.</p>
											<p style="text-align: justify;">&ldquo;<strong>Content</strong>&rdquo; means text, graphics, images, music, software (excluding the
													Application), audio, video, information or other materials.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Guest</strong>&rdquo; means a member who requests a booking of an accommodation via
													the site, application or Services, or a member who stays at an accommodation and is not the Host
													for such accommodation.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Host</strong>&rdquo; means a member who creates a listing via the site, application
													and services.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Listing</strong>&rdquo; means an accommodation that is listed by a Host as available
													for rental via the site, application, and services.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Member</strong>&rdquo; means a person who completes StayPlanet&rsquo;s account registration
													process, including, but not limited to Hosts and Guests, as described under &ldquo;Account Registration&rdquo;
													below.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Member Content</strong>&rdquo; means all content that a member posts, uploads, publishes,
													submits or transmits to be made available through the site, application or services.
											</p>
											<p style="text-align: justify;">&ldquo;<strong>Tax</strong>&rdquo; or &ldquo;<strong>Taxes</strong>&rdquo; mean any sales taxes,
													value added taxes (VAT) and other local authority or national taxes or other withholding, personal
													or corporate income taxes.<br />Certain areas of the site and application (and your access to
													or use of certain aspects of the services or collective content) may have different terms and
													conditions posted or may require you to agree with and accept additional terms and conditions.
													If there is a conflict between these terms and terms and conditions posted for a specific area
													of the site, application, services, or collective content, the latter terms and conditions will
													take precedence with respect to your use of or access to that area of the site, application,
													services, or collective content.<br />You acknowledge and agree that, by accessing or using the
													site, application or services or by downloading or posting any content from or on the site, via
													the application or through the services, or by participating in the referral program, you are
													indicating that you have read, and that you understand and agree to be bound by these terms,
													whether or not you have registered with the site and application. If you do not agree to these
													terms, then you have no right to access or use the site, application, services, or collective
													content or to participate in the referral program. If you accept or agree to these terms on behalf
													of a company or other legal entity, you represent and warrant that you have the authority to
													bind that company or other legal entity to these terms and, in such event, &ldquo;you&rdquo;
													and &ldquo;your&rdquo; will refer and apply to that company or other legal entity.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>Modification</strong></p>
											<p style="text-align: justify;">StayPlanet reserves the right, at its sole discretion, to modify the site, application or services
													or to modify these terms, including the service fees, at any time and without prior notice. If
													we modify these terms, we will notify our members via email of said modification. By continuing
													to access or use the site, application or services after we have provided you with notice of
													a modification, you are indicating that you agree to be bound by the modified terms. If the modified
													terms are not acceptable to you, your only recourse is to cease using the site, application and
													services.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>Eligibility</strong></p>
											<p style="text-align: justify;">The site, application and services are intended solely for persons who are 18 or older. Any access
													to or use of the site, application or services by anyone under 18 is expressly prohibited. By
													accessing or using the site, application or services you represent and warrant that you are 18
													or older.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>How the Site, Application and Services Work&nbsp;</strong></p>
											<p style="text-align: justify;">The site, application and services can be used to facilitate the listing and booking of residential
													and other properties (&ldquo;accommodation&rdquo;). Such Accommodations are included in Listings
													on the site, application and services by Hosts. You may view Listings as an unregistered visitor
													to the site, application and services; however, if you wish to book an accommodation create a
													Listing, you must first register to create a StayPlanet Account (defined below).<br /><br /><br
													/>As stated above, StayPlanet makes available a platform or marketplace with related technology
													for Guests and Hosts to meet online and arrange for bookings of accommodations. StayPlanet is
													not an owner or operator of properties, including, but not limited to, hotel rooms, bed and breakfast,
													other lodgings or accommodations, nor is it a provider of properties, including, but not limited
													to, hotel rooms, bed and breakfasts, other lodgings or accommodations and StayPlanet does not
													own, sell, resell, furnish, provide, rent, re-rent, manage and/or control properties, including,
													but not limited to, hotel rooms, bed and breakfasts, other lodgings or accommodations or transportation
													or travel services. StayPlanet&rsquo;s responsibilities are limited to: (i) facilitating the
													availability of the site, application and services and (ii) serving as the limited agent of each
													Host for the purpose of accepting payments from Guests on behalf of the Host.<br />Please note
													that, as stated above, the site, application and services are intended to be used to facilitate
													the booking of accommodations. Stayplanet cannot and does not control the content contained in
													any listings and is not aware of the condition, legality or suitability of any accommodations.
													Stayplanet is not responsible for and disclaims any and all liability related to any and all
													listings and accommodations. Accordingly, any bookings will be made at the guest&rsquo;s own
													risk.
													<br /><br /><br /><strong>Account Registration&nbsp;</strong>
											</p>
											<p style="text-align: justify;"><strong>&nbsp;</strong>In order to access certain features of the site and application, and to book
													an accommodation or create a Listing, you must register to create an account (&ldquo;StayPlanet
													Account&rdquo;) and become a member. You may register to join the services directly via the site
													or application or as described in this section.
											</p>
											<p style="text-align: justify;">You can also register to join by logging into your account with certain third party social networking
													sites (&ldquo;SNS&rdquo;) (including, but not limited to, Facebook); each such account, a &ldquo;Third
													Party Account&rdquo;, via our site or application, as described below. As part of the functionality
													of the site, application and services, you may link your StayPlanet Account with Third Party
													Accounts, by either: (i) providing your Third Party Account login information to StayPlanet through
													the site, services or application; or (ii) allowing StayPlanet to access your Third Party Account,
													as is permitted under the applicable terms and conditions that govern your use of each Third
													Party Account. You represent that you are entitled to disclose your Third Party Account login
													information to StayPlanet and/or grant StayPlanet access to your Third Party Account (including,
													but not limited to, for use for the purposes described herein), without breach by you of any
													of the terms and conditions that govern your use of the applicable Third Party Account and without
													obligating StayPlanet to pay any fees or making StayPlanet subject to any usage limitations imposed
													by such third party service providers. By granting StayPlanet access to any Third Party Accounts,
													you understand that StayPlanet will access, make available and store (if applicable) any Content
													that you have provided to and stored in your Third Party Account (&ldquo;SNS Content&rdquo;)
													so that it is available on and through the site, services and application via your StayPlanet
													Account and StayPlanet Account profile page. Unless otherwise specified in these terms, all SNS
													Content, if any, will be considered to be Member Content for all purposes of these terms. Depending
													on the Third Party Accounts you choose and subject to the privacy settings that you have set
													in such Third Party Accounts, personally identifiable information that you post to your Third
													Party Accounts will be available on and through your StayPlanet Account on the site, services
													and application. Please note that if a Third Party Account or associated service becomes unavailable
													or StayPlanet&rsquo;s access to such Third Party Account is terminated by the third party service
													provider, then SNS Content will no longer be available on and through the site, services and
													application.
											</p>
											<p style="text-align: justify;">You have the ability to disable the connection between your StayPlanet Account and your Third Party
													Accounts, at any time, by accessing the &ldquo;Settings&rdquo; section of the Site and Application.&nbsp;<strong>PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE THIRD PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD PARTY SERVICE PROVIDERS</strong>.
													StayPlanet makes no effort to review any SNS Content for any purpose, including but not limited
													to, for accuracy, legality or non-infringement and StayPlanet is not responsible for any SNS
													Content.
											</p>
											<p style="text-align: justify;">We will create your StayPlanet Account and your StayPlanet Account profile page for your use of the
													site and application based upon the personal information you provide to us or that we obtain
													via an SNS as described above. You may not have more than one (1) active StayPlanet Account.
													You agree to provide accurate, current and complete information during the registration process
													and to update such information to keep it accurate, current and complete. StayPlanet reserves
													the right to suspend or terminate your StayPlanet Account and your access to the site, application
													and services if you create more than one StayPlanet Account or if any information provided during
													the registration process or thereafter proves to be inaccurate, not current or incomplete. You
													are responsible for safeguarding your password. You agree that you will not disclose your password
													to any third party and that you will take sole responsibility for any activities or actions under
													your StayPlanet Account, whether or not you have authorised such activities or actions. You will
													immediately notify StayPlanet of any unauthorised use of your StayPlanet Account.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>Accommodation Listings</strong></p>
											<p style="text-align: justify;"><strong>&nbsp;</strong>As a Member, you may create Listings. To this end, you will be asked a variety
													of questions about the Accommodation to be listed, including, but not limited to, the location,
													capacity, size, features, availability of the Accommodation and pricing and related rules and
													financial terms. In order to be featured in Listings via the site, application and services,
													all Accommodations must have valid physical addresses. Listings will be made publicly available
													via the site, application and services. Other Members will be able to book your Accommodation
													via the site, application and services based upon the information provided in your Listing. You
													understand and agree that once a Guest requests a booking of your Accommodation, the price for
													such booking may not be altered.
											</p>
											<p style="text-align: justify;">You acknowledge and agree that you are responsible for any and all Listings you post. Accordingly,
													you represent and warrant that any Listing you post and the booking of, or Guest stay at, an
													Accommodation in a Listing you post (i) will not breach any agreements you have entered into
													with any third parties and (ii) will (a) be in compliance with all applicable laws, Tax requirements,
													and rules and regulations that may apply to any Accommodation included in a Listing you post,
													including, but not limited to, planning regulations and laws governing rentals of residential
													and other properties and (b) not conflict with the rights of third parties. Please note that
													StayPlanet assumes no responsibility for a Host&rsquo;s compliance with any applicable laws,
													rules and regulations. StayPlanet reserves the right, at any time and without prior notice, to
													remove or disable access to any Listing for any reason, including Listings that StayPlanet, in
													its sole discretion, considers to be objectionable for any reason, in violation of these Terms
													or otherwise harmful to the site, application or services.
											</p>
											<p style="text-align: justify;">You understand and agree that StayPlanet does not act as an insurer or as a contracting agent for
													you as a Host. If a Guest requests a booking of your Accommodation and stays at your Accommodation,
													any agreement you enter into with such Guest is between you and the Guest and StayPlanet is not
													a party thereto. Notwithstanding the foregoing, StayPlanet serves as the limited authorised agent
													of the Host for the purpose of accepting payments from Guests on behalf of the Host and is responsible
													for transmitting such payments to the Host.When you create a Listing, you may also choose to
													include certain requirements which must be met by the Members who are eligible to request a booking
													of your Accommodation, including, but not limited to, requiring Members to have a profile picture
													or verified phone number, in order to book your Accommodation. Any Member wishing to book Accommodations
													included in Listings with such requirements must meet these requirements.
											</p>
											<p style="text-align: justify;">If you are a Host, StayPlanet makes certain tools available to you to help you to make informed decisions
													about which Members you choose to confirm for booking for your Accommodation. You acknowledge
													and agree that, as a Host, you are responsible for your own acts and omissions and are also responsible
													for the acts and omissions of any individuals who reside at or are otherwise present at the Accommodation
													at your request or invitation, excluding the Guest (and the individuals the Guest invites to
													the Accommodation, if applicable).
											</p>
											<p style="text-align: justify;">StayPlanet recommends that Hosts obtain appropriate insurance for their Accommodations. Please review
													any insurance policy that you may have for your Accommodation carefully, and in particular please
													make sure that you are familiar with and understand any exclusions to, and any deductibles that
													may apply for, such insurance policy, including, but not limited to, whether or not your insurance
													policy will cover the actions or inactions of Guests (and the individuals the Guest invites to
													the Accommodation, if applicable) while at your Accommodation.<br /><br /><br /><strong>No Endorsement</strong>
											</p>
											<p style="text-align: justify;"><strong>&nbsp;</strong>StayPlanet does not endorse any Members or any Accommodations. In addition,
													although these Terms require Members to provide accurate information, we do not attempt to confirm,
													and do not confirm, any Member&rsquo;s purported identity. You are responsible for determining
													the identity and suitability of others who you contact via the site, application and services.<br
													/>By using the site, application or services, you agree that any legal remedy or liability that
													you seek to obtain for actions or omissions of other Members or other third parties will be limited
													to a claim against the particular Members or other third parties who caused you harm and you
													agree not to attempt to impose liability on, or seek any legal remedy from StayPlanet with respect
													to such actions or omissions. Accordingly, we encourage you to communicate directly with other
													Members on the site and services regarding any bookings or Listings made by you.<br />This limitation
													shall not apply to any claim by a Host against StayPlanet regarding the remittance of payments
													received from a Guest by StayPlanet on behalf of a Host.<br /><br /><br /><strong>Bookings and Financial Terms</strong>
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><span style="text-decoration: underline;">Bookings and Financial Terms for Hosts&nbsp;</span></p>
											<p style="text-align: justify;">If you are a Host and a booking is requested for your Accommodation via the site, application and
													services, you will be required to either confirm or reject the booking within 24 hours of when
													the booking is requested (as determined by StayPlanet in its sole discretion) or the booking
													request will be automatically cancelled.
											</p>
											<p style="text-align: justify;">The fees displayed in each Listing are comprised of the Accommodation Fees (defined below) and the
													Guest Fees (defined below.) Where applicable, taxes may be charged in addition to the Accommodation
													Fees and Guest Fees. The Accommodation Fees, the Guest Fees and applicable Taxes are collectively
													referred to in these Terms as the &ldquo;Total Fees&rdquo;. The amounts due and payable by a
													Guest solely relating to a Host&rsquo;s Accommodation are the &ldquo;Accommodation Fees&rdquo;.
													Please note that it is the Host and not StayPlanet which determines the Accommodation Fees. The
													Accommodation Fee may include a cleaning fee, at the Host&rsquo;s discretion.
											</p>
											<p style="text-align: justify;">StayPlanet charges a fee to Guests based upon a percentage of applicable Accommodation Fees which
													are the &ldquo;Guest Fees&rdquo;. The Guest Fees are added to the Accommodation Fees to calculate
													the Total Fees (which will also include applicable Taxes) displayed in the applicable Listing.
													StayPlanet will collect the Total Fees at the time of booking confirmation (i.e. when the Host
													confirms the booking within 24 hours of the booking request) and will initiate payment of the
													Accommodation Fees (less StayPlanet&rsquo;s Host Fees (defined below)) to the Host within 72
													hours of when the Guest arrives at the applicable Accommodation (except to the extent that a
													refund is due to the Guest).<br /><br /><br /><span style="text-decoration: underline;">Appointment of StayPlanet as Payment Agent for Host&nbsp;</span>
											</p>
											<p style="text-align: justify;">Each Host hereby appoints StayPlanet as the Host&rsquo;s limited agent solely for the purpose of
													collecting payments made by Guests on behalf of the Host. Each Host agrees that payment made
													by a Guest to StayPlanet shall be considered the same as a payment made directly to the Host
													and the Host will make the Accommodation available to the Guest in the agreed upon manner as
													if the Host has received the Accommodation Fees.
											</p>
											<p style="text-align: justify;">Each Host agrees that, StayPlanet may, in accordance with the cancellation policy selected by the
													Host and reflected in the relevant Listing, (i) permit the Guest to cancel the booking and (ii)
													refund to the Guest that portion of the Accommodation Fees specified in the applicable cancellation
													policy. In accepting appointment as the limited authorised agent of the Host, StayPlanet assumes
													no liability for any acts or omissions of the Host.
											</p>
											<p style="text-align: justify;">Please note that StayPlanet does not currently charge fees for the creation of Listings. However,
													you acknowledge and agree that StayPlanet reserves the right, in its sole discretion, to charge
													you for and collect fees from you for the creation of Listings. Please note that StayPlanet will
													provide notice of any Listing fee collection via the site, application and services, prior to
													implementing such a Listing fee feature.<br /><br /><br /><span style="text-decoration: underline;">Bookings and Financial Terms for Guests&nbsp;</span>
											</p>
											<p style="text-align: justify;">The Hosts, not StayPlanet, are solely responsible for honoring any confirmed bookings and making
													available any Accommodations reserved through the site, application and services. If you, as
													a Guest, choose to enter into a transaction with a Host for the booking of an Accommodation,
													you agree and understand that you will be required to enter into an agreement with the Host and
													you agree to accept any terms, conditions, rules and restrictions associated with such Accommodation
													imposed by the Host. You acknowledge and agree that you, and not StayPlanet, will be responsible
													for performing the obligations of any such agreements, that StayPlanet is not a party to such
													agreements, and that, with the exception of its payment obligations hereunder, StayPlanet disclaims
													all liability arising from or related to any such agreements. You acknowledge and agree that,
													notwithstanding the fact that StayPlanet is not a party to the agreement between you and the
													Host, StayPlanet acts as the Host&rsquo;s payment agent for the limited purpose of accepting
													payments from you on behalf of the Host. Upon your payment of amounts to StayPlanet which are
													due to the Host, your payment obligation to the Host for such amounts is extinguished, and StayPlanet
													is responsible for remitting such amounts, less StayPlanet&rsquo;s Host Fees, to the Host. In
													the event that StayPlanet does not remit any such amounts to a Host, such Host will have recourse
													only against StayPlanet.
											</p>
											<p style="text-align: justify;">Listings for Accommodations will specify the Total Fees. As noted above, the Host is required to
													either confirm or reject the booking within 24 hours of when the booking is requested (as determined
													by StayPlanet in its sole discretion) or the requested booking will be automatically cancelled.
													If a requested booking is cancelled (i.e. not confirmed by the applicable Host), any amounts
													collected by StayPlanet will be refunded to such Guest, depending on the selections the Guest
													makes via the Site and Application, and any pre-authorisation of such Guest&rsquo;s credit card
													will be released, if applicable.
											</p>
											<p style="text-align: justify;">You agree to pay StayPlanet for the Total Fees for any booking requested in connection with your
													StayPlanet Account if such requested bookings are confirmed by the applicable Host. In order
													to establish a booking pending the applicable Host&rsquo;s confirmation of your requested booking,
													you understand and agree that StayPlanet, on behalf of the Host, reserves the right, in its sole
													discretion, to (i) obtain a pre-authorisation via your credit card for the Total Fees or (ii)
													charge your credit card a nominal amount, not to exceed one Euro (&euro;1), or a similar sum
													in the currency in which you are transacting (e.g. one Dollar or one British pound) to verify
													your credit card. Once StayPlanet receives confirmation of your booking from the applicable Host,
													StayPlanet will collect the Total Fees in accordance with the terms and conditions of these Terms
													and the pricing terms set forth in the applicable Listing. Please note that StayPlanet cannot
													control any fees that may be charged to a Guest by his or her bank related to StayPlanet&rsquo;s
													collection of the Total Fees, and StayPlanet disclaims all liability in this regard.
											</p>
											<p style="text-align: justify;">In connection with your requested booking, you will be asked to provide customary billing information
													such as name, billing address and credit card information either to StayPlanet or its third party
													payment processor. You agree to pay StayPlanet for any confirmed bookings made in connection
													with your StayPlanet Account in accordance with these Terms by one of the methods described on
													the site or application &ndash; e.g. by PayPal or credit card. You hereby authorise the collection
													of such amounts by charging the credit card provided as part of requesting the booking, either
													directly by StayPlanet or indirectly, via a third party online payment processor or by one of
													the payment methods described on the site or application. You also authorise StayPlanet to charge
													your credit card in the event of damage caused at an Accommodation as contemplated under &ldquo;Damage
													to Accommodations&rdquo; below and for Security Deposits, if applicable.<br />If you are directed
													to StayPlanet&rsquo;s third party payment processor, you may be subject to terms and conditions
													governing use of that third party&rsquo;s service and that third party&rsquo;s personal information
													collection practices. Please review such terms and conditions and privacy policy before using
													the services. Once your confirmed booking transaction is complete you will receive a confirmation
													email summarising your confirmed booking.<br /><br /><br /><span style="text-decoration: underline;">Security Deposits</span>
											</p>
											<p style="text-align: justify;">Hosts may choose to include security deposits in their Listings (&ldquo;Security Deposits&rdquo;).
													Each Listing will describe whether a Security Deposit is required for the applicable Accommodation.
													If a Security Deposit is included in a Listing for a confirmed booking of Accommodation, StayPlanet
													will, in its capacity as the payment agent of the Host, use its commercially reasonable efforts
													to obtain a pre-authorisation of the Guest&rsquo;s credit card in the amount the Host determines
													for the Security Deposit within a reasonable time prior to the Guest&rsquo;s check-in at the
													applicable Host&rsquo;s Accommodation. StayPlanet will also use its commercially reasonable efforts
													to address Hosts&rsquo; requests and claims related to Security Deposits, but StayPlanet is not
													responsible for administering or accepting any claims by Hosts related to Security Deposits,
													and disclaims any and all liability in this regard.<br /><br /><br /><span style="text-decoration: underline;">Service Fees</span>
											</p>
											<p style="text-align: justify;">In consideration for providing the Services, StayPlanet collects service fees from Hosts and Guests
													(&ldquo;Service Fees&rdquo;). Service Fees are made up of two (2) components: (i) Guest Fees
													and (ii) a fee that is charged to the Host based upon a percentage of the amount of the Accommodation
													Fees (&ldquo;Host Fees&rdquo;).Where applicable, taxes may also be charged in addition to the
													Host Fees. Host Fees are deducted from the Accommodation Fees before remitting the Accommodation
													Fees to the Host, within 24 hours of when the Guest arrives at the applicable Accommodation.
													Guest Fees are, as noted above, included in the Total Fees.&nbsp;
											</p>
											<p style="text-align: justify;">Balances will be remitted by StayPlanet to Hosts via cheque, PayPal, direct deposit or other payment
													methods described on the site or via the application, in the Host&rsquo;s currency of choice,
													depending upon the selections the Host makes via the site, application and services. Please note
													that for any payments by StayPlanet in currencies other than Euros, StayPlanet may deduct foreign
													currency processing costs from such payments.<br /><br /><br /><strong>General Booking and Financial Terms</strong>
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><span style="text-decoration: underline;">Cancellations and Refunds&nbsp;</span></p>
											<p style="text-align: justify;">If, as a Guest, you cancel your requested booking before the requested booking is confirmed by a
													Host, StayPlanet will cancel any pre-authorisation to your credit card and/or refund any nominal
													amounts charged to your credit card in connection with the requested booking within a commercially
													reasonable time. If, as a Guest, you wish to cancel a confirmed booking made via the site, application
													and services, either prior to or after arriving at the Accommodation, the cancellation policy
													of the Host contained in the applicable Listing will apply to such cancellation. Our ability
													to refund the Accommodation Fees and other amounts charged to you will depend upon the terms
													of the applicable cancellation policy. Details regarding refunds and cancellation policies are
													available via the site and application.
											</p>
											<p style="text-align: justify;">If a Host cancels a confirmed booking made via the site, services, and application, (i) StayPlanet
													will refund the Total Fees for such booking to the applicable Guest within a commercially reasonable
													time of the cancellation and (ii) the Guest will receive an email or other communication from
													StayPlanet containing alternative Listings and other related information. If the Guest requests
													a booking from one of the alternative Listings and the Host associated with such alternative
													Listing confirms the Guest&rsquo;s requested booking, then the Guest agrees to pay StayPlanet
													the Total Fees relating to the confirmed booking for the Accommodation in the alternative Listing,
													in accordance with these Terms. If a Host cancelled a confirmed booking and you, as a Guest,
													have not received an email or other communication from StayPlanet, please contact StayPlanet
													at http://www.stayplanet.com/contact.<br /><br /><br /><span style="text-decoration: underline;">Recurring Payments&nbsp;</span>
											</p>
											<p style="text-align: justify;">In some instances, Guests may be required to make recurring, incremental payments toward the Total
													Fees owed for a confirmed booking before beginning his or her stay at the applicable Accommodation
													(collectively, &ldquo;Recurring Payments&rdquo;). More information on Recurring Payments will
													be made available via the site, application and services, if applicable. If Recurring Payments
													apply to your payment obligations for Total Fees owed for a confirmed booking, you authorise
													StayPlanet, on behalf of the Host, to collect the Total Fees in the increments and at the frequency
													associated with the applicable Recurring Payments, identified on the site, application and services.<br
													/><br /><br /><span style="text-decoration: underline;">Donations&nbsp;</span>
											</p>
											<p style="text-align: justify;">Some Hosts may pledge to donate a portion of the funds they receive from confirmed bookings made
													via the site, application and services to a particular cause or charity. We do not control, and
													will not take any responsibility or liability for, whether the Host does in fact make the donation
													he or she pledged to make.<br /><br /><br /><span style="text-decoration: underline;">Taxes&nbsp;</span>
											</p>
											<p style="text-align: justify;">You understand and agree that you are solely responsible for determining your applicable Tax reporting
													requirements in consultation with your tax advisors. StayPlanet cannot and does not offer tax-related
													advice to any Members of the site, application and services. Additionally, please note that each
													Host is responsible for determining local direct and indirect taxes and for including any applicable
													taxes to be collected or obligations relating to applicable taxes in Listings. Where applicable,
													or based upon request from a Host, StayPlanet may issue a valid VAT invoice to such Host.<br
													/><br /><br /><span style="text-decoration: underline;">Foreign Currency&nbsp;</span>
											</p>
											<p style="text-align: justify;">As part of the services, StayPlanet provides a feature through which Members may view Total Fees
													for various Listings in foreign currencies. You understand and agree that these views of Total
													Fees are for informational purposes only and are not the official Total Fees for the Listings.
													If you (as a Guest) request a booking, you will be notified of the currency in which you will
													be charged together with the corresponding amount of Total Fees, if your booking is confirmed
													by a Host. The currency in which you will be charged will be determined by StayPlanet based on
													the payment method you select and the location of the Accommodation in the Listing you are booking.
											</p>
											<p style="text-align: justify;">If the currency in which you will be charged is different from the currency chosen by the Host to
													receive payment, StayPlanet will be responsible for the required currency conversion processing,
													including the costs thereof, which will be calculated based on the most current applicable foreign
													exchange rate that StayPlanet has uploaded to the site as of the date and time that your booking
													is confirmed (the &ldquo;Applicable Exchange Rate&rdquo;).
											</p>
											<p style="text-align: justify;">You acknowledge that the Applicable Exchange Rate used for currency conversion processing may not
													be identical to the applicable market rate in effect at the specific time such processing occurs
													because: (i) although StayPlanet updates the Applicable Exchange Rate on a regular basis, it
													does not update such rate on a real-time basis; and (ii) the Applicable Exchange Rate may include
													an incremental cost or margin that is not included in the applicable market rate. For the avoidance
													of doubt, StayPlanet will retain any profits (and will bear any losses) that result from such
													currency conversion processing due to changes in the applicable foreign exchange rate between
													the date your booking is confirmed and the date StayPlanet makes payment to a Host.<br/><br
													/><br /><span style="text-decoration: underline;">Damage to Accommodations&nbsp;</span>
											</p>
											<p style="text-align: justify;">As a Guest, you are responsible for leaving the Accommodation in the condition it was in when you
													arrived. You acknowledge and agree that, as a Guest, you are responsible for your own acts and
													omissions and are also responsible for the acts and omissions of any individuals who you invite
													to, or otherwise provide access to, the Accommodation. In the event that a Host claims otherwise
													and provides evidence of damage, including but not limited to, photographs, you agree to pay
													the cost of replacing the damaged items with equivalent items.
											</p>
											<p style="text-align: justify;">After being notified of the claim and given forty eight (48) hours to respond, the payment will be
													charged to and taken from the credit card on file in your StayPlanet Account. StayPlanet also
													reserves the right to charge the credit card on file in your StayPlanet Account, or otherwise
													collect payment from you and pursue any avenues available to StayPlanet in this regard, including
													using Security Deposits, in situations in which you have been determined, in StayPlanet&rsquo;s
													sole discretion, to have damaged any Accommodation, including, but not limited to, in relation
													to any payment requests made by Hosts under the StayPlanet Host Guarantee, and in relation to
													any payments made by StayPlanet to Hosts. If we are unable to charge the credit card on file
													or otherwise collect payment from you, you agree to remit payment for any damage to the Accommodation
													to the applicable Host or to StayPlanet (if applicable).
											</p>
											<p style="text-align: justify;">Both Guests and Hosts agree to cooperate with and assist StayPlanet in the utmost of good faith,
													and to provide StayPlanet with such information and take such actions as may be reasonably requested
													by StayPlanet, in connection with any complaints or claims made by Members relating to Accommodations
													or any personal or other property located at an Accommodation (including, without limitation,
													payment requests made under the StayPlanet Host Guarantee) or with respect to any investigation
													undertaken by StayPlanet or a representative of StayPlanet regarding use or abuse of the site,
													application or the services. If you are a Guest, upon StayPlanet&rsquo;s reasonable request,
													and to the extent you are reasonably able to do so, you agree to participate in mediation or
													similar resolution process with a Host, at no cost to you, which process will be conducted by
													StayPlanet or a third party selected by StayPlanet, with respect to losses for which the Host
													is requesting payment from StayPlanet under the StayPlanet Host Guarantee.
											</p>
											<p style="text-align: justify;">If you are a Guest, you understand and agree that StayPlanet reserves the right, in its sole discretion,
													to make a claim under your homeowner&rsquo;s, tenant&rsquo;s or other insurance policy related
													to any damage or loss that you may have caused or been responsible for to an Accommodation or
													any personal or other property located at an Accommodation (including amounts paid by StayPlanet
													under the StayPlanet Host Guarantee.) You agree to cooperate with and assist StayPlanet in utmost
													of good faith, and to provide StayPlanet with such information as may be reasonably requested
													by StayPlanet in order to make a claim under your homeowner&rsquo;s, tenant&rsquo;s or other
													insurance policy, including, but not limited to, executing documents and taking such further
													acts as StayPlanet may reasonably request to assist StayPlanet in accomplishing the foregoing.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><span style="text-decoration: underline;">User Conduct</span></p>
											<p style="text-align: justify;">You understand and agree that you are solely responsible for compliance with any and all laws, rules,
													regulations, and tax obligations that may apply to your use of the site, application, services
													and Content. In connection with your use of our site, application and services, you may not and
													you agree that you will not:
											</p>
											<ul style="text-align: justify;">
													<li>violate any local, provincial, national, or other law or regulation, or any order of a court,
															including, without limitation, planning restrictions, fire safety, disability,health and
															safety and tax regulations;
													</li>
													<li>use manual or automated software, devices, scripts robots, other means or processes to access,
															&ldquo;scrape,&rdquo; &ldquo;crawl&rdquo; or &ldquo;spider&rdquo; any web pages or other
															services contained in the site, application, services or content;
													</li>
													<li>use the site, application or services for any commercial or other purposes that are not expressly
															permitted by these Terms;
													</li>
													<li>copy, store or otherwise access any information contained on the site, application, services
															or content for purposes not expressly permitted by these Terms;
													</li>
													<li>infringe the rights of any person or entity, including without limitation, their intellectual
															property, privacy, publicity or contractual rights;
													</li>
													<li>interfere with or damage our site, application or services, including, without limitation, through
															the use of viruses, cancel bots, Trojan horses, harmful code, flood pings, denial-of-service
															attacks, packet or IP spoofing, forged routing or electronic mail address information or
															similar methods or technology;
													</li>
													<li>use our site, application or services to transmit, distribute, post or submit any information
															concerning any other person or entity, including without limitation, photographs of others
															without their permission, personal contact information or credit, debit, calling card or
															account numbers;
													</li>
													<li>use our site, application or services in connection with the distribution of unsolicited commercial
															email ("spam") or advertisements unrelated to lodging in a private residence;
													</li>
													<li>"stalk" or harass any other user of our site, application, or services or collect or store any
															personally identifiable information about any other user other than for purposes of transacting
															as an StayPlanet Guest or Host;
													</li>
													<li>offer, as a Host, any Accommodations that you do not yourself own or have permission to rent
															as a residential or other property (without limiting the foregoing, you will not list Accommodations
															as a Host if you are serving in the capacity of a rental agent or listing agent for a third
															party);
													</li>
													<li>offer, as a Host, any Accommodation that may not be rented or subleased pursuant to the terms
															and conditions of an agreement with a third party, including, but not limited to, a property
															rental agreement;
													</li>
													<li>register for more than one StayPlanet Account or register for a StayPlanet Account on behalf
															of an individual other than yourself;
													</li>
													<li>contact a Host for any purpose other than asking a question related to a booking, such Host&rsquo;s
															Accommodations or Listings;
													</li>
													<li>contact a Guest for any purpose other than asking a question related to a booking or such Guest&rsquo;s
															use of the site, application and services;
													</li>
													<li>when acting as a Guest or otherwise, recruit or otherwise solicit any Host or other Member to
															join third party services or websites that are competitive to StayPlanet, without StayPlanet&rsquo;s
															prior written approval;
													</li>
													<li>impersonate any person or entity, or falsify or otherwise misrepresent yourself or your affiliation
															with any person or entity;
													</li>
													<li>use automated scripts to collect information or otherwise interact with the site, application
															or services;
													</li>
													<li>use the site, application and services to find a Host or Guest and then complete a booking of
															an Accommodation transaction independent of the site, application or services in order to
															circumvent the obligation to pay any Service Fees related to StayPlanet&rsquo;s provision
															of the services;
													</li>
													<li>as a Host, submit any Listing with false or misleading price information, or submit any Listing
															with a price that you do not intend to honour;
													</li>
													<li>or post, upload, publish, submit or transmit any content that: (i) infringes, misappropriates
															or violates a third party&rsquo;s patent, copyright, trademark, trade secret, moral rights
															or other intellectual property rights, or rights of publicity or privacy; (ii) violates,
															or encourages any conduct that would violate, any applicable law or regulation or would give
															rise to civil liability; (iii) is fraudulent, false, misleading or deceptive; (iv) is defamatory,
															obscene, pornographic, vulgar or offensive; (v) promotes discrimination, bigotry, racism,
															hatred, harassment or harm against any individual or group; (vi) is violent or threatening
															or promotes violence or actions that are threatening to any other person; or (vii) promotes
															illegal or harmful activities or substances;
													</li>
													<li>systematically retrieve data or other content from our site, application or services to create
															or compile, directly or indirectly, in single or multiple downloads, a collection, compilation,
															database, directory or the like, whether by manual methods, through the use of bots, crawlers,
															or spiders, or otherwise;
													</li>
													<li>use, display, mirror or frame the site or application, or any individual element within the site,
															services, or application, StayPlanet&rsquo;s name, any StayPlanet trademark, logo or other
															proprietary information, or the layout and design of any page or form contained on a page,
															without StayPlanet&rsquo;s express written consent;
													</li>
													<li>access, tamper with, or use non-public areas of the site or application, StayPlanet&rsquo;s computer
															systems, or the technical delivery systems of StayPlanet&rsquo;s providers;</li>
													<li>attempt to probe, scan, or test the vulnerability of any StayPlanet system or network or breach
															any security or authentication measures;
													</li>
													<li>avoid, bypass, remove, deactivate, impair, descramble, or otherwise circumvent any technological
															measure implemented by StayPlanet or any of StayPlanet&rsquo;s providers or any other third
															party (including another user) to protect the site, services, application or Collective Content;</li>
													<li>forge any TCP/IP packet header or any part of the header information in any email or newsgroup
															posting, or in any way use the site, services, application or Collective Content to send
															altered, deceptive or false source-identifying information;
													</li>
													<li>attempt to decipher, decompile, disassemble or reverse engineer any of the software used to provide
															the site, services, application or Collective Content; or advocate, encourage, or assist
															any third party in doing any of the foregoing.StayPlanet will have the right to investigate
															and prosecute violations of any of the above to the fullest extent of the law. StayPlanet
															may involve and cooperate with law enforcement authorities in prosecuting users who violate
															these Terms. You acknowledge that StayPlanet has no obligation to monitor your access to
															or use of the site, application, services or Collective Content or to review or edit any
															Member Content, but has the right to do so for the purpose of operating the site, application
															and services, to ensure your compliance with these Terms, or to comply with applicable law
															or the order or requirement of a court, administrative agency or other governmental body.
															StayPlanet reserves the right, at any time and without prior notice, to remove or disable
															access to any Collective Content that StayPlanet, at its sole discretion, considers to be
															objectionable for any reason, in violation of these Terms or otherwise harmful to the site,
															application or services.
													</li>
											</ul>
											<br/>
											<p style="text-align: justify;"><strong>Privacy</strong></p>
											<p style="text-align: justify;">See StayPlanet&rsquo;s Privacy Policy at http://www.stayplanet.com/pages/privacy-policy and for information
													and notices concerning StayPlanet&rsquo;s collection and use of your personal information.
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>Ownership</strong></p>
											<p style="text-align: justify;">The site, application, services, and Collective Content are protected by copyright, trademark, and
													other laws.You acknowledge and agree that the site, application, services and Collective Content,
													including all associated intellectual property rights is the exclusive property of StayPlanet
													and its licensors. You will not remove, alter or obscure any copyright, trademark, service mark
													or other proprietary rights notices incorporated in or accompanying the site, application, services,
													or Collective Content.&nbsp;
											</p>
											<p style="text-align: justify;">&nbsp;</p>
											<p style="text-align: justify;"><strong>StayPlanet Content and Member Content License</strong></p>
											<p style="text-align: justify;">Subject to your compliance with the terms and conditions of these Terms, StayPlanet grants you a
													limited, non-exclusive, non-transferable licence, to (i) access and view any StayPlanet Content
													solely for your personal and non-commercial purposes and (ii) access and view any Member Content
													to which you are permitted access, solely for your personal and non-commercial purposes.
											</p>
									</div>
							</div>
					</div>
			</div>
		</div>
	</ion-content>
  `
})
export class TermsAndConditions {

	constructor(
		public viewCtrl: ViewController) {
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}

@Component({
	template: `
	<ion-header>
		<ion-toolbar>
				<ion-title><ion-icon ios="ios-clipboard" md="md-clipboard"></ion-icon> Privacy Policy</ion-title>
				<ion-buttons start>
					<button ion-button (click)="dismiss()">
						<span ion-text color="primary" showWhen="ios">Cancel</span>
						<ion-icon name="md-close" showWhen="android,windows"></ion-icon>
					</button>
				</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content padding>
			<div class="middle_section" id="content_text">
					<h1>Privacy-Policy</h1>
						<div>
							<p>This Privacy Policy administers the way in which StayPlanet collects, uses, preserves, and discloses information
									collected from individual users of the <a href="https://www.stayplanet.com/">StayPlanet's&nbsp;</a>&nbsp;website.
									The policy applied to all areas of the site, and all products and services offered by StayPlanet.
							</p>
							<p>&nbsp;</p>
							<p><strong>Personal identification information</strong></p>
							<p>StayPlanet is authorised to collect personal information from users in a number of ways including, but not limited
									to, registration, activities, features, resources, and activities available on our site. Users may be asked
									for personal information; however, they can visit the site anonymously.
							</p>
							<p>StayPlanet will collect personal information from users only if they voluntarily submit it to us, and StayPlanet
									will respect the wishes of users who decide not to supply personal information. However, users must be aware
									that if they do so they may be prevented from engaging in certain activities.
							</p>
							<p>&nbsp;</p>
							<p><strong>Non-personal identification information</strong></p>
							<p>StayPlanet may collect non-personal information about users every time they interact with the site. This includes
									non-personal and technical information about users connected to the site, such as the operating system and
									internet service providers.
							</p>
							<p>&nbsp;</p>
							<p><strong>Web browser cookies</strong></p>
							<p>StayPlanet may use &lsquo;cookies&rsquo; to enhance user experience, and may place them on their users hard drive
									to keep a record and track information. Users may choose to disable their cookies. If they do so they acknowledge
									the site may not function properly.
							</p>
							<p>&nbsp;</p>
							<p><strong>How we use collected information</strong></p>
							<p>StayPlanet collects and uses Users personal information to improve customer service, to respond to customer service
									requests, support needs, personalise user experience, and to understand how users access the services and
									resources of our site. We also collect information to process transactions, provide services when placing
									an order, to send periodic emails, to administer content for promotion, survey and other site features. The
									email address users provide will only be used to send information and updates pertaining to their order.
									StayPlanet also uses information to respond to inquiries. Users can opt-out of our mailing list; however
									they will receive emails including company news, update, and product information.
							</p>
							<p>&nbsp;</p>
							<p><strong>How we protect your information</strong></p>
							<p>StayPlanet adopts data collection, storage and processing practices, and security practices to protect against
									unauthorised disclosure or destruction of your personal information stored on our site. Private data exchange
									is protected and encrypted between the site and its users.
							</p>
							<p>&nbsp;</p>
							<p><strong>Compliance with children's online privacy protection existing at the time</strong></p>
							<p>StayPlanet never collects or maintains information on our site from anybody under the age of 18, and in no way
									structures our website to attract younger viewers.
							</p>
							<p>&nbsp;</p>
							<p><strong>Use of images</strong></p>
							<p>This site claims no credit for any images posted on this site unless otherwise noted. Images on this website
									are copyright to its respectful owners. If there is an image appearing on this website that belongs to you
									and you do not wish for it to appear on this site, please E-mail StayPlanet at <a href="mailto:info@stayplanet.com">info@stayplanet.com</a> with a link to said image and it will be promptly removed.
							</p>
							<p>&nbsp;</p>
							<p><strong>Changes to this privacy policy</strong></p>
							<p>StayPlanet has the discretion to update this policy at any time. If an update occurs, users will be notified
									via the main page of our site, the copyright date at the bottom of the page will change, and an email will
									be sent. Users acknowledge their responsibility to periodically check for these changes.
							</p>
							<p>&nbsp;</p>
							<p><strong>Your acceptance of these terms</strong></p>
							<p>By using this site, you acknowledge your acceptance of these policies and terms of services. If you do not agree
									to this policy, do not use the site.
							</p>
							<p>&nbsp;</p>
							<p><strong>Privacy query or complaint</strong></p>
							<p>Should you have a privacy query or complaint; please do not hesitate to contact our office through our contact
									details listed below either by phone, email or by post.
							</p>
							<p>&nbsp;</p>
							<p><strong>Sharing of Personal Information/data</strong></p>
							<p>Personal information/data pertaining to &ldquo;the host&rdquo; and or &ldquo;the guest&rdquo; is not shared.</p>
							<p>&nbsp;</p>
							<p><strong>Contacting us</strong></p>
							<p>&nbsp;if you have any questions about this Privacy Policy, please contact us <a href="https://www.stayplanet.com/contact-us">here</a>.</p>
					</div>
			</div>
	</ion-content>
  `
})
export class PrivacyPolicy {

	constructor(
		public viewCtrl: ViewController) {
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}