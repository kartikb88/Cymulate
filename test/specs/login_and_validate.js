import { expect } from 'chai';

describe('Validate Cymulate login, WAF URL, assessment status, and overall score', () => {
    const validEmail = 'candidate_user@cymulate.com';
    const validPassword = 'Aa123456';

    it('Validate Cymulate login, WAF URL, assessment status, and overall score', async () => {
        await browser.url('/login');
       
        const emailInput = $('input[type="email"]');
        const passwordInput = $('input[type="password"]');
        const signInButton = $('button[type="submit"]');

        await emailInput.setValue(validEmail);
        await passwordInput.setValue(validPassword);
        await signInButton.click();

        const dashboardTab = $('[test-label="Dashboard"]');
        await dashboardTab.waitForDisplayed(2000);
        
        const reportsTab = $('a[test-label="Reports"]');
        await reportsTab.click();

        const webAppFirewallHistoryLink = $('a[href="/waf_reports/?client=candidate_user"]');
        await webAppFirewallHistoryLink.waitForDisplayed(2000);
        await webAppFirewallHistoryLink.click();

        const firstRow = $('//div[@class="table-row attack-item-container"]/a');
        await firstRow.waitForDisplayed(2000);
        await firstRow.click();
        await browser.pause(3000)
        const wafUrl = 'https://ekslabs.cymulatedev.com';
        const expectedStatus = 'Completed';
        const expectedScore = 29;

        const wafUrlElement = $$('//div[@class="summary-data"]/div[@class="report-summary-data"]')[0];
        const assessmentStatusElement = $('[data-for="assessment_status"]');
        const overallScoreElement = $('//div[@class="score-text"]/span/span');
        
        await wafUrlElement.waitForDisplayed();
        await assessmentStatusElement.waitForDisplayed();
        await overallScoreElement.waitForDisplayed(2000);

        const actualWafUrl = await wafUrlElement.getText();
        const actualStatus = await assessmentStatusElement.getText();
        const actualScore = parseInt(await overallScoreElement.getText(), 10);

        expect(actualWafUrl).to.equal(wafUrl);
        expect(actualStatus).to.equal(expectedStatus);
        expect(actualScore).to.equal(expectedScore);
    });

    
});
