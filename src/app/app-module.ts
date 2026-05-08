import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LanguageSwitcher } from './language-switcher/language-switcher';
import { Home } from './shared/presentation/views/home/home';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { BaseForm } from './shared/presentation/components/base-form/base-form';
import { Layout } from './shared/presentation/components/layout/layout';
import { SignInForm } from './iam/presentation/views/sign-in-form/sign-in-form';
import { SignUpForm } from './iam/presentation/views/sign-up-form/sign-up-form';
import { AuthenticationSection } from './iam/presentation/components/authentication-section/authentication-section';
import { CustomSupplyForm } from './arm/presentation/views/custom-supply-form/custom-supply-form';
import { CustomSupplyItem } from './arm/presentation/components/custom-supply-item/custom-supply-item';
import { CustomSupplyList } from './arm/presentation/components/custom-supply-list/custom-supply-list';
import { CustomSupplySection } from './arm/presentation/views/custom-supply-section/custom-supply-section';
import { RecipeForm } from './planning/presentation/views/recipe-form/recipe-form';
import { RecipeList } from './planning/presentation/components/recipe-list/recipe-list';
import { RecipeItem } from './planning/presentation/components/recipe-item/recipe-item';
import { RecipeSection } from './planning/presentation/views/recipe-section/recipe-section';
import { DashboardSection } from './analytics/presentation/views/dashboard-section/dashboard-section';

@NgModule({
  declarations: [
    App,
    LanguageSwitcher,
    Home,
    PageNotFound,
    BaseForm,
    Layout,
    SignInForm,
    SignUpForm,
    AuthenticationSection,
    CustomSupplyForm,
    CustomSupplyItem,
    CustomSupplyList,
    CustomSupplySection,
    RecipeForm,
    RecipeList,
    RecipeItem,
    RecipeSection,
    DashboardSection,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
