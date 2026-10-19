/* =====================================================================
   Salesforce Developer Evaluation – question bank
   Source: "Salesforce Practice Paper – Persistent Systems Readiness".
   Items marked "remix" are reworked versions of an original question,
   added because the source paper had only 8 coding / 6 scenario items.

   Rubric points (used for provisional auto-scoring of written answers):
     { k: "label", w: marks, any: [regex...] }   matched if ANY regex matches
     { k: "label", w: marks, all: [regex...] }   matched if ALL regexes match
     { k: "label", w: marks, order: [regex...] } matched if all appear in this order
   ===================================================================== */

/* ---------------- Section A: multiple choice (answer = index into options) */
const MCQ_BANK = {
  1: { topic: "Security", q: "Account OWD is Private. Priya (Sales Rep) owns an Account. Ravi is her manager, above her in the role hierarchy. Kiran is another Sales Rep at Priya's level. Who can view the Account?", options: ["Priya only", "Priya and Ravi", "Priya, Ravi and Kiran", "All users"], answer: 1, why: "Users above the owner in the role hierarchy get the owner's access; peers do not." },
  2: { topic: "Security", q: "Sharing rules can be used to:", options: ["Restrict access below the OWD", "Open access beyond the OWD", "Override field-level security", "Grant Delete without the object permission"], answer: 1, why: "Sharing only ever opens access. OWD sets the most restrictive baseline." },
  3: { topic: "Security", q: "A user can open an Account but cannot see its Annual Revenue field. Which layer is most likely responsible?", options: ["OWD", "Field-Level Security", "Role hierarchy", "Sharing rule"], answer: 1, why: "FLS controls field visibility for every record of that object." },
  4: { topic: "Security", q: "\"Grant Access Using Hierarchies\" can be switched off for:", options: ["Standard objects only", "Custom objects only", "Both", "Neither"], answer: 1, why: "It is always on for standard objects." },
  5: { topic: "Security", q: "The OWD of the detail object in a master-detail relationship is:", options: ["Private", "Public Read Only", "Controlled by Parent", "Public Read/Write"], answer: 2, why: "Access to the detail record follows access to the master." },
  6: { topic: "Security", q: "The share object for a custom object Invoice__c is:", options: ["Invoice__c_Share", "Invoice__Share", "InvoiceShare", "Invoice__History"], answer: 1, why: "Custom object X__c gets share object X__Share." },
  7: { topic: "Security", q: "Which keyword makes an Apex class run in the caller's sharing mode, and in with sharing mode when it is the entry point?", options: ["with sharing", "without sharing", "inherited sharing", "No keyword"], answer: 2, why: "inherited sharing takes the caller's mode and defaults to with sharing." },
  8: { topic: "Security", q: "Which SOQL clause enforces object permissions, FLS and record sharing for the running user?", options: ["WITH SECURITY_ENFORCED", "WITH USER_MODE", "FOR VIEW", "ALL ROWS"], answer: 1, why: "USER_MODE enforces CRUD, FLS and sharing. SECURITY_ENFORCED skips sharing and throws on the first hidden field." },
  9: { topic: "Async Apex", q: "A future method:", options: ["Can return a String", "Must be static and return void", "Can take sObjects as parameters", "Can call another future method"], answer: 1, why: "Static void, primitive parameters only, no future-from-future." },
  10: { topic: "Async Apex", q: "To make an HTTP callout from Queueable Apex, the class must also implement:", options: ["Database.Stateful", "Database.AllowsCallouts", "Schedulable", "Nothing extra"], answer: 1, why: "Database.AllowsCallouts." },
  11: { topic: "Async Apex", q: "The maximum scope size for a Batch class using Database.QueryLocator is:", options: ["200", "2,000", "10,000", "50,000,000"], answer: 1, why: "2,000 (default 200)." },
  12: { topic: "Async Apex", q: "A Batch class must keep a running count of records across execute() calls. It should implement:", options: ["Database.Stateful", "Database.Batchable only", "Queueable", "Database.RaisesPlatformEvents"], answer: 0, why: "Instance variables survive between execute() calls only with Database.Stateful." },
  13: { topic: "Async Apex", q: "System.enqueueJob() returns:", options: ["void", "The Id of the AsyncApexJob", "Boolean", "A QueueableContext"], answer: 1, why: "The job Id, which can be queried from AsyncApexJob." },
  14: { topic: "Async Apex", q: "The cron expression 0 0 22 * * ? runs a scheduled job:", options: ["Every 22 minutes", "Every day at 10 PM", "On the 22nd of each month", "Every hour"], answer: 1, why: "Seconds 0, minutes 0, hour 22, every day." },
  15: { topic: "Async Apex", q: "In a test class, asynchronous jobs queued in the test are forced to complete at:", options: ["Test.startTest()", "Test.stopTest()", "The end of the @TestSetup method", "They never run in tests"], answer: 1, why: "Test.stopTest() runs all async work queued after startTest()." },
  16: { topic: "Async Apex", q: "A trigger on Account inserts a GroupMember record and fails with MIXED_DML_OPERATION. The standard fix is to:", options: ["Use Database.insert with allOrNone = false", "Move the GroupMember DML into a future method", "Mark the class without sharing", "Increase the batch size"], answer: 1, why: "Setup and non-setup DML must run in separate transactions." },
  17: { topic: "LWC", q: "Which decorator exposes a property so a parent component can set it?", options: ["@track", "@wire", "@api", "@public"], answer: 2, why: "@api makes a property public." },
  18: { topic: "LWC", q: "A child component sends data to its parent by:", options: ["Setting an @api property on the parent", "Dispatching a CustomEvent", "Calling refreshApex", "Using a getter"], answer: 1, why: "this.dispatchEvent(new CustomEvent('name', { detail }))." },
  19: { topic: "LWC", q: "Two components sit in different regions of a Lightning page and have no parent-child relationship. The recommended way to communicate is:", options: ["@api properties", "CustomEvent with bubbles: true", "Lightning Message Service", "A static Apex variable"], answer: 2, why: "LMS works across the DOM, and with Aura and Visualforce." },
  20: { topic: "LWC", q: "Which lifecycle hook runs first?", options: ["renderedCallback", "connectedCallback", "constructor", "disconnectedCallback"], answer: 2, why: "constructor → connectedCallback → render → renderedCallback." },
  21: { topic: "LWC", q: "Which lifecycle hook captures errors thrown by descendant components?", options: ["errorCallback", "renderedCallback", "disconnectedCallback", "connectedCallback"], answer: 0, why: "errorCallback(error, stack)." },
  22: { topic: "LWC", q: "To make a wire call re-run when the record changes, the parameter is written as:", options: ["recordId", "'$recordId'", "{recordId}", "this.recordId"], answer: 1, why: "The $ prefix makes the parameter reactive." },
  23: { topic: "LWC", q: "An Apex method used with @wire must be annotated:", options: ["@AuraEnabled", "@AuraEnabled(cacheable=true)", "@RemoteAction", "@InvocableMethod"], answer: 1, why: "Wired methods must be cacheable and read-only." },
  24: { topic: "LWC", q: "Which lightning-datatable attribute uniquely identifies each row?", options: ["row-id", "key-field", "data-id", "record-id"], answer: 1, why: "key-field, usually \"Id\"." },
  25: { topic: "Integrations", q: "Which annotation exposes an Apex class as a custom REST endpoint?", options: ["@HttpGet", "@RestResource", "@AuraEnabled", "@WebService"], answer: 1, why: "@RestResource(urlMapping='/path/*') on a global class." },
  26: { topic: "Integrations", q: "The recommended place to store an external endpoint URL and its authentication is:", options: ["A custom label", "Hard-coded in Apex", "A Named Credential", "A custom setting text field"], answer: 2, why: "Named Credentials keep URL and auth out of code." },
  27: { topic: "Integrations", q: "In a test class, HTTP callouts are simulated with:", options: ["Test.setMock with an HttpCalloutMock implementation", "Test.isRunningTest()", "Test.loadData", "They cannot be tested"], answer: 0, why: "Test.setMock(HttpCalloutMock.class, new MyMock())." },
  28: { topic: "Integrations", q: "Code performs DML and then an HTTP callout in the same transaction. The result is:", options: ["It works", "\"You have uncommitted work pending\" error", "The DML rolls back silently", "The callout is queued automatically"], answer: 1, why: "Do callouts first, or move them to async Apex." },
  29: { topic: "Apex fundamentals", q: "The synchronous limit on SOQL queries per transaction is:", options: ["50", "100", "150", "200"], answer: 1, why: "100 sync, 200 async." },
  30: { topic: "Apex fundamentals", q: "Trigger.oldMap is NOT available in:", options: ["before update", "after delete", "before insert", "after update"], answer: 2, why: "No old values exist on insert." }
};

/* ---------------- Section B: short answer (3–5 lines) */
const SHORT_BANK = {
  S1: { topic: "Security", q: "What is the difference between a Profile and a Permission Set? Why does Salesforce now recommend a minimal profile plus permission sets?",
    model: "A Profile is assigned one per user and holds baseline permissions, login hours and IP ranges. Permission Sets are additive and many can be assigned. Salesforce plans to move permissions off profiles, so a minimal profile plus permission sets (and permission set groups) avoids profile sprawl and is easier to audit.",
    points: [
      { k: "Profile: exactly one per user / baseline", w: 1, any: [/one (profile )?per user|only one profile|single profile|one profile|baseline|mandatory|every user (must )?ha(s|ve) a profile/] },
      { k: "Permission sets are additive / many per user", w: 1, any: [/additive|multiple permission sets|many permission sets|more than one|extend|additional (access|permission)|on top of/] },
      { k: "Why minimal profile: least privilege / avoid profile sprawl / permissions moving off profiles", w: 1, any: [/least privilege|minimum access|minimal profile|profile sprawl|too many profiles|retire|end of life|moving permissions|move permissions|flexib/] },
      { k: "Permission set groups / easier to manage and audit", w: 1, any: [/permission set group|audit|maintain|manage|scal|reus/] }
    ] },
  S2: { topic: "Security", q: "Compare owner-based and criteria-based sharing rules. Give one example where each is the right choice.",
    model: "Owner-based rules share records owned by members of a role or group with another role or group, e.g. East reps' Accounts shared with West reps. Criteria-based rules share by field values, e.g. Opportunities with Amount > 10 lakh shared with Finance.",
    points: [
      { k: "Owner-based: by record owner's role/group", w: 1, all: [/owner|owned by/, /role|group/] },
      { k: "Criteria-based: by field values", w: 1, any: [/criteria.{0,60}(field|value|condition)|field values?|based on (a )?field/] },
      { k: "Owner-based example", w: 1, any: [/(east|west|north|south|region|team|territor|branch).{0,80}(share|with|access)/, /owned by.{0,80}(role|group|team)/] },
      { k: "Criteria-based example (field condition)", w: 1, any: [/(amount|status|stage|type|priority|industry|rating|region|lakh)\s*(=|>|<|is|equals|greater|over|above|more than)/] }
    ] },
  S3: { topic: "Async Apex", q: "List three differences between Future methods and Queueable Apex.",
    model: "Future takes only primitives; Queueable takes sObjects and complex types. Future returns nothing; enqueueJob returns a job Id for monitoring. Future cannot call future; a Queueable can chain one child job.",
    points: [
      { k: "Parameters: primitives only vs sObjects/complex types", w: 1, any: [/primitive|sobject|complex|non-primitive/] },
      { k: "Monitoring: job Id from enqueueJob", w: 1, any: [/job ?id|monitor|asyncapexjob|track/] },
      { k: "Chaining", w: 1, any: [/chain/] },
      { k: "Another valid difference (future-from-future, static void, interface vs annotation)", w: 1, any: [/future.{0,40}(cannot|can'?t|not).{0,30}(call|invoke)|static void|interface|implements queueable|annotation|@future|return/] }
    ] },
  S4: { topic: "Async Apex", q: "Name the three methods of the Database.Batchable interface and state what each one does.",
    model: "start() collects the records (QueryLocator or Iterable). execute(bc, scope) processes each chunk in its own transaction with fresh limits. finish() runs once at the end for summary, emails or chaining another batch.",
    points: [
      { k: "start() – collects records (QueryLocator / Iterable)", w: 1, all: [/\bstart\b/, /querylocator|iterable|collect|query|fetch|gather|records/] },
      { k: "execute() – processes each chunk/scope", w: 1, all: [/\bexecute\b/, /chunk|scope|batch|process/] },
      { k: "finish() – runs once at the end", w: 1, all: [/\bfinish\b/, /end|once|after|post|email|summary|chain|final/] },
      { k: "Detail: own transaction / fresh limits / email or chaining in finish", w: 1, any: [/fresh limits|own transaction|separate transaction|new transaction|governor|post-?processing|send (an )?email|chain/] }
    ] },
  S5: { topic: "Async Apex", q: "How do you schedule a Batch class to run every night? Name the interface and the method used to schedule it.",
    model: "Implement Schedulable, call Database.executeBatch() inside execute(SchedulableContext), then schedule with System.schedule(name, cron, instance) or from Setup → Apex Classes → Schedule Apex.",
    points: [
      { k: "Schedulable interface", w: 1.5, any: [/schedulable/] },
      { k: "execute(SchedulableContext) calls Database.executeBatch", w: 1, any: [/executebatch|schedulablecontext/] },
      { k: "System.schedule(...) or Setup → Schedule Apex", w: 1, any: [/system\.schedule|schedule apex/] },
      { k: "Cron expression for nightly run", w: 0.5, any: [/cron|0 0 \d+|\* \* \?/] }
    ] },
  S6: { topic: "LWC", q: "A parent LWC contains a child LWC. Give the order in which constructor, connectedCallback and renderedCallback fire across parent and child.",
    model: "Parent constructor → parent connectedCallback → child constructor → child connectedCallback → child renderedCallback → parent renderedCallback.",
    points: [
      { k: "Parent constructor before parent connectedCallback", w: 1, order: [/parent\W{0,3}constructor/, /parent\W{0,3}connected/] },
      { k: "Parent connectedCallback before child constructor", w: 1, order: [/parent\W{0,3}connected/, /child\W{0,3}constructor/] },
      { k: "Child constructor → child connectedCallback → child renderedCallback", w: 1, order: [/child\W{0,3}constructor/, /child\W{0,3}connected/, /child\W{0,3}rendered/] },
      { k: "Child renderedCallback before parent renderedCallback", w: 1, order: [/child\W{0,3}rendered/, /parent\W{0,3}rendered/] }
    ] },
  S7: { topic: "LWC", q: "When would you call an Apex method imperatively instead of with @wire? Give two reasons.",
    model: "Use imperative when the method does DML (wired methods must be cacheable), when the call should run on a user action such as a button click, or when you need to control timing and handle the promise.",
    points: [
      { k: "Method does DML / is not cacheable", w: 1.5, any: [/dml|insert|update|delete|cacheable|modif|write|save/] },
      { k: "Runs on a user action (button click / event)", w: 1.5, any: [/click|button|user action|event|on demand|on-demand|submit/] },
      { k: "Control timing / handle promise / conditional call", w: 1, any: [/promise|then|await|async|timing|control|condition|when needed|refresh/] }
    ] },
  S8: { topic: "LWC", q: "List the steps to set up Lightning Message Service between a publisher and a subscriber component.",
    model: "Create a LightningMessageChannel metadata file. In both components import it plus publish/subscribe and MessageContext from lightning/messageService. The publisher calls publish(); the subscriber calls subscribe() in connectedCallback and unsubscribe() in disconnectedCallback.",
    points: [
      { k: "Create a Lightning Message Channel (metadata)", w: 1, any: [/message ?channel/] },
      { k: "Import from lightning/messageService + MessageContext", w: 1, any: [/lightning\/messageservice|messagecontext/] },
      { k: "Publisher calls publish()", w: 0.5, any: [/publish/] },
      { k: "Subscriber calls subscribe()", w: 0.5, any: [/subscribe/] },
      { k: "unsubscribe() in disconnectedCallback", w: 1, any: [/unsubscribe|disconnectedcallback/] }
    ] },
  S9: { topic: "Integrations", q: "What is the difference between inbound and outbound integration? How does an external system authenticate for an inbound REST call?",
    model: "Inbound: an external system calls Salesforce. Outbound: Salesforce calls an external system. For inbound REST the caller authenticates through OAuth 2.0 with a Connected App (or External Client App), then sends the access token as a Bearer header.",
    points: [
      { k: "Inbound = external system calls Salesforce", w: 1, any: [/inbound.{0,80}(into|to|calls?|hits?|sends?).{0,30}salesforce/, /external.{0,40}(calls?|into|to|sends?).{0,20}salesforce/] },
      { k: "Outbound = Salesforce calls external system", w: 1, any: [/outbound.{0,80}(external|third)/, /salesforce.{0,40}(calls?|sends?|to).{0,30}(external|third)/] },
      { k: "OAuth 2.0", w: 1, any: [/oauth/] },
      { k: "Connected App / access token as Bearer header", w: 1, any: [/connected app|external client app|access token|bearer|session id|jwt/] }
    ] },
  S10: { topic: "Apex fundamentals", q: "What is bulkification? Show in one or two lines what non-bulkified trigger code looks like.",
    model: "Writing code that handles a whole list of records (up to 200 per trigger chunk) with collections, one query and one DML. Non-bulkified: for (Contact c : Trigger.new) { Account a = [SELECT Id FROM Account WHERE Id = :c.AccountId]; } — this hits 101 SOQL with 101 records.",
    points: [
      { k: "Handles many records at once using collections (List/Set/Map, 200)", w: 1.5, any: [/collection|list|set|map|multiple records|many records|all records|200|bulk/] },
      { k: "No SOQL/DML inside loops – one query, one DML", w: 1, any: [/outside (the |a )?loop|no (soql|query|dml)|single query|one query|inside (a |the )?(for )?loop|in (a |the )?loop/] },
      { k: "Example: query or DML inside a for loop", w: 1.5, any: [/for\s*\([^)]*\)[\s\S]{0,120}(\[\s*select|insert |update |delete )/] }
    ] }
};

/* ---------------- Section C: coding (6 marks each) */
const CODING_BANK = {
  C1: { topic: "Triggers", title: "Trigger with handler – Contact count",
    q: "Account has a number field Number_of_Contacts__c. Keep it accurate when Contacts are inserted, updated (including moving to another Account), deleted and undeleted. Use a trigger plus a handler class, with no SOQL or DML in loops. Write one test method that inserts 200 Contacts.",
    model: String.raw`trigger ContactTrigger on Contact (after insert, after update, after delete, after undelete) {
    ContactTriggerHandler.updateContactCount(Trigger.new, Trigger.oldMap);
}
public with sharing class ContactTriggerHandler {
    public static void updateContactCount(List<Contact> newList, Map<Id, Contact> oldMap) {
        Set<Id> accountIds = new Set<Id>();
        if (newList != null) for (Contact c : newList) if (c.AccountId != null) accountIds.add(c.AccountId);
        if (oldMap != null) for (Contact c : oldMap.values()) if (c.AccountId != null) accountIds.add(c.AccountId);
        if (accountIds.isEmpty()) return;
        Map<Id, Integer> counts = new Map<Id, Integer>();
        for (Id accId : accountIds) counts.put(accId, 0);
        for (AggregateResult ar : [SELECT AccountId accId, COUNT(Id) cnt FROM Contact
                                   WHERE AccountId IN :accountIds GROUP BY AccountId]) {
            counts.put((Id) ar.get('accId'), (Integer) ar.get('cnt'));
        }
        List<Account> toUpdate = new List<Account>();
        for (Id accId : counts.keySet()) toUpdate.add(new Account(Id = accId, Number_of_Contacts__c = counts.get(accId)));
        update toUpdate;
    }
}
@IsTest
private class ContactTriggerHandlerTest {
    @IsTest static void countsContactsInBulk() {
        Account acc = new Account(Name = 'Test Account'); insert acc;
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < 200; i++) contacts.add(new Contact(LastName = 'Contact ' + i, AccountId = acc.Id));
        Test.startTest(); insert contacts; delete contacts[0]; Test.stopTest();
        Assert.areEqual(199, [SELECT Number_of_Contacts__c FROM Account WHERE Id = :acc.Id].Number_of_Contacts__c);
    }
}`,
    points: [
      { k: "Trigger on Contact covering after insert/update/delete/undelete", w: 1, all: [/trigger\s+\w+\s+on\s+contact/, /after\s+delete/, /after\s+undelete/] },
      { k: "Separate handler class called from trigger", w: 0.5, any: [/class\s+\w*handler/, /\w+\.\w+\s*\(\s*trigger\./] },
      { k: "Uses old values (Trigger.old/oldMap) for reparent and delete", w: 0.5, any: [/trigger\.old|oldmap/] },
      { k: "Counts with an aggregate COUNT() query", w: 1, any: [/count\s*\(|aggregateresult/] },
      { k: "Bulkified: Set<Id> + single update outside loop", w: 1, all: [/set\s*<\s*id\s*>/, /update\s+\w+\s*;|database\.update/] },
      { k: "Best practice: with sharing / null and empty checks", w: 1, any: [/with sharing|isempty\s*\(\)|!=\s*null/] },
      { k: "Test method inserting 200 Contacts", w: 1, all: [/@istest|testmethod/, /200/] }
    ] },
  C2: { topic: "Batch Apex", title: "Batch Apex – close stale Opportunities",
    q: "Every Opportunity whose CloseDate has passed and which is still open must be set to Closed Lost. Write a Batch class that does this, counts how many records were updated, and emails the count to the running user when finished. Show the line that runs it.",
    model: String.raw`public class CloseStaleOpportunitiesBatch implements Database.Batchable<SObject>, Database.Stateful {
    private Integer recordsClosed = 0;
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, StageName FROM Opportunity WHERE CloseDate < TODAY AND IsClosed = false]);
    }
    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        for (Opportunity opp : scope) opp.StageName = 'Closed Lost';
        for (Database.SaveResult sr : Database.update(scope, false)) if (sr.isSuccess()) recordsClosed++;
    }
    public void finish(Database.BatchableContext bc) {
        AsyncApexJob job = [SELECT Status, NumberOfErrors FROM AsyncApexJob WHERE Id = :bc.getJobId()];
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>{ UserInfo.getUserEmail() });
        mail.setSubject('Stale Opportunity cleanup: ' + job.Status);
        mail.setPlainTextBody('Opportunities closed: ' + recordsClosed + '\nBatches with errors: ' + job.NumberOfErrors);
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
    }
}
// Run it:
Database.executeBatch(new CloseStaleOpportunitiesBatch(), 200);`,
    points: [
      { k: "Implements Database.Batchable", w: 1, any: [/database\.batchable/] },
      { k: "start() returns a QueryLocator", w: 0.5, any: [/querylocator/] },
      { k: "Filters CloseDate < TODAY and still open", w: 0.5, any: [/closedate\s*<\s*(today|:?\s*(system\.)?date\.today)/, /isclosed\s*=\s*false/] },
      { k: "execute() sets StageName = 'Closed Lost'", w: 1, any: [/stagename\s*=\s*'closed lost'/] },
      { k: "Database.Stateful with a running counter", w: 1, all: [/database\.stateful/, /\+\+|\+=/] },
      { k: "finish() emails the running user", w: 1, all: [/finish/, /singleemailmessage|sendemail/] },
      { k: "Database.executeBatch line", w: 0.5, any: [/database\.executebatch/] },
      { k: "Partial-success DML (Database.update(scope,false) / SaveResult)", w: 0.5, any: [/database\.update\s*\(|saveresult/] }
    ] },
  C3: { topic: "Schedulable Apex", title: "Schedulable Apex – nightly run",
    q: "Write a Schedulable class that runs the batch from the previous question (CloseStaleOpportunitiesBatch), and the anonymous Apex line that schedules it every day at 1:00 AM.",
    model: String.raw`public class CloseStaleOpportunitiesScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new CloseStaleOpportunitiesBatch(), 200);
    }
}
// Schedule it (anonymous Apex):
System.schedule('Close stale opportunities - daily 1 AM', '0 0 1 * * ?', new CloseStaleOpportunitiesScheduler());`,
    points: [
      { k: "Implements Schedulable", w: 1.5, any: [/implements\s+schedulable|schedulable/] },
      { k: "execute(SchedulableContext ...)", w: 1, any: [/execute\s*\(\s*schedulablecontext/] },
      { k: "Calls Database.executeBatch inside execute", w: 1, any: [/database\.executebatch/] },
      { k: "System.schedule(name, cron, instance)", w: 1, any: [/system\.schedule\s*\(/] },
      { k: "Correct cron '0 0 1 * * ?'", w: 1.5, any: [/['"]\s*0\s+0\s+1\s+\*\s+\*\s+\?\s*\*?\s*['"]/] }
    ] },
  C4: { topic: "Future methods", title: "Future method – mixed DML",
    q: "When an Account with Type = 'Key Account' is inserted, add its owner to the public group Key_Account_Owners. A direct insert fails with MIXED_DML_OPERATION. Write the trigger and a future method that does the group insert, skipping users already in the group.",
    model: String.raw`trigger AccountTrigger on Account (after insert) {
    Set<Id> ownerIds = new Set<Id>();
    for (Account acc : Trigger.new) if (acc.Type == 'Key Account') ownerIds.add(acc.OwnerId);
    if (!ownerIds.isEmpty()) GroupMembershipService.addUsersToGroup(ownerIds, 'Key_Account_Owners');
}
public class GroupMembershipService {
    @future
    public static void addUsersToGroup(Set<Id> userIds, String groupDeveloperName) {
        Group grp = [SELECT Id FROM Group WHERE DeveloperName = :groupDeveloperName LIMIT 1];
        Set<Id> existing = new Set<Id>();
        for (GroupMember gm : [SELECT UserOrGroupId FROM GroupMember WHERE GroupId = :grp.Id AND UserOrGroupId IN :userIds])
            existing.add(gm.UserOrGroupId);
        List<GroupMember> members = new List<GroupMember>();
        for (Id userId : userIds) if (!existing.contains(userId)) members.add(new GroupMember(GroupId = grp.Id, UserOrGroupId = userId));
        if (!members.isEmpty()) insert members;
    }
}`,
    points: [
      { k: "Trigger on Account, after insert", w: 1, all: [/trigger\s+\w+\s+on\s+account/, /after\s+insert/] },
      { k: "Checks Type == 'Key Account'", w: 0.5, any: [/type\s*==\s*'key account'/] },
      { k: "@future static void method", w: 1, all: [/@future/, /static\s+void/] },
      { k: "Passes Ids (Set<Id>/List<Id>), not sObjects", w: 1, any: [/(set|list)\s*<\s*id\s*>/] },
      { k: "Looks up the group (DeveloperName)", w: 0.5, any: [/from\s+group\b|developername/] },
      { k: "Skips users already in the group", w: 1, all: [/from\s+groupmember/, /contains\s*\(|existing/] },
      { k: "Builds GroupMember list and inserts once", w: 1, all: [/new\s+groupmember\s*\(/, /insert\s+\w+\s*;|database\.insert/] }
    ] },
  C5: { topic: "Queueable Apex", title: "Queueable with callout and chaining",
    q: "Given a list of Account Ids, call an external address API through the Named Credential Address_API with the Account's BillingPostalCode and update BillingCity and BillingState from the JSON response (fields city and state). Process 50 Accounts per job and chain a new job for the rest.",
    model: String.raw`public class AddressSyncQueueable implements Queueable, Database.AllowsCallouts {
    private static final Integer CHUNK_SIZE = 50;
    private List<Id> accountIds;
    public AddressSyncQueueable(List<Id> accountIds) { this.accountIds = accountIds; }
    public void execute(QueueableContext ctx) {
        List<Id> current = new List<Id>(), remaining = new List<Id>();
        for (Integer i = 0; i < accountIds.size(); i++) { if (i < CHUNK_SIZE) current.add(accountIds[i]); else remaining.add(accountIds[i]); }
        List<Account> toUpdate = new List<Account>();
        for (Account acc : [SELECT Id, BillingPostalCode FROM Account WHERE Id IN :current AND BillingPostalCode != null]) {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:Address_API/address?postalCode=' + EncodingUtil.urlEncode(acc.BillingPostalCode, 'UTF-8'));
            req.setMethod('GET'); req.setTimeout(20000);
            HttpResponse res = new Http().send(req);
            if (res.getStatusCode() == 200) {
                Map<String, Object> body = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                toUpdate.add(new Account(Id = acc.Id, BillingCity = (String) body.get('city'), BillingState = (String) body.get('state')));
            }
        }
        if (!toUpdate.isEmpty()) update toUpdate;            // all callouts happen before DML
        if (!remaining.isEmpty() && !Test.isRunningTest()) System.enqueueJob(new AddressSyncQueueable(remaining));
    }
}
// Start it: System.enqueueJob(new AddressSyncQueueable(accountIdList));`,
    points: [
      { k: "Implements Queueable and Database.AllowsCallouts", w: 1.5, all: [/queueable/, /database\.allowscallouts/] },
      { k: "Uses Named Credential 'callout:Address_API'", w: 1, any: [/callout:address_api/] },
      { k: "Builds HttpRequest and sends it", w: 0.5, all: [/httprequest/, /\.send\s*\(/] },
      { k: "Parses JSON and reads city/state", w: 1, all: [/json\.deserialize/, /city/, /state/] },
      { k: "50 per job and chains with System.enqueueJob", w: 1, all: [/50/, /system\.enqueuejob/] },
      { k: "Single update after all callouts (no DML before callout)", w: 1, any: [/update\s+\w+\s*;|database\.update/] }
    ] },
  C6: { topic: "Apex managed sharing", title: "Apex managed sharing – Reviewer",
    q: "Custom object Project__c has OWD Private and a lookup Reviewer__c to User. When a Reviewer is set or changed, share the Project with that user as Read Only, and remove the share from the previous reviewer. Use an Apex sharing reason named Reviewer.",
    model: String.raw`trigger ProjectTrigger on Project__c (after insert, after update) {
    ProjectSharingService.shareWithReviewers(Trigger.new, Trigger.oldMap);
}
public without sharing class ProjectSharingService {
    public static void shareWithReviewers(List<Project__c> projects, Map<Id, Project__c> oldMap) {
        List<Project__Share> sharesToInsert = new List<Project__Share>();
        Set<Id> projectsToClear = new Set<Id>();
        for (Project__c p : projects) {
            Project__c oldP = (oldMap == null) ? null : oldMap.get(p.Id);
            if (oldP != null && oldP.Reviewer__c == p.Reviewer__c) continue;        // no change
            if (oldP != null && oldP.Reviewer__c != null) projectsToClear.add(p.Id);
            if (p.Reviewer__c != null && p.Reviewer__c != p.OwnerId) {
                sharesToInsert.add(new Project__Share(ParentId = p.Id, UserOrGroupId = p.Reviewer__c,
                    AccessLevel = 'Read', RowCause = Schema.Project__Share.RowCause.Reviewer__c));
            }
        }
        if (!projectsToClear.isEmpty()) delete [SELECT Id FROM Project__Share WHERE ParentId IN :projectsToClear
                                                 AND RowCause = :Schema.Project__Share.RowCause.Reviewer__c];
        if (!sharesToInsert.isEmpty()) Database.insert(sharesToInsert, false);
    }
}`,
    points: [
      { k: "Trigger on Project__c (after insert/update)", w: 1, all: [/on\s+project__c/, /after\s+(insert|update)/] },
      { k: "Creates Project__Share with UserOrGroupId and AccessLevel 'Read'", w: 1.5, all: [/project__share/, /userorgroupid/, /accesslevel\s*=\s*'read'/] },
      { k: "RowCause = Reviewer__c sharing reason", w: 1, any: [/rowcause[\s\S]{0,80}reviewer__c/] },
      { k: "Deletes previous reviewer's share using old values", w: 1, all: [/oldmap|trigger\.old/, /delete/] },
      { k: "Bulk: List<Project__Share> with single insert/delete", w: 0.5, any: [/list\s*<\s*project__share\s*>/] },
      { k: "Best practice: skip owner / no-change check / without sharing / partial insert", w: 1, any: [/ownerid|without sharing|database\.insert\s*\([^)]*false|==\s*p\.reviewer__c|continue/] }
    ] },
  C7: { topic: "LWC", title: "LWC parent-child with data table",
    q: "On the Account record page, a parent component shows the number of selected Contacts. A child component loads the Account's Contacts with @wire from Apex, shows them in a lightning-datatable (Name, Email, Phone) and tells the parent when rows are selected. Write the Apex controller, child HTML and JS, and parent HTML and JS.",
    model: String.raw`// Apex
public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name, Email, Phone FROM Contact WHERE AccountId = :accountId WITH USER_MODE ORDER BY Name LIMIT 200];
    }
}
<!-- contactList.html -->
<template>
  <template lwc:if={contacts}>
    <lightning-datatable key-field="Id" data={contacts} columns={columns} onrowselection={handleRowSelection}></lightning-datatable>
  </template>
  <template lwc:if={error}><p class="slds-text-color_error">{error}</p></template>
</template>
// contactList.js
import { LightningElement, api, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
const COLUMNS = [ { label: 'Name', fieldName: 'Name' }, { label: 'Email', fieldName: 'Email', type: 'email' }, { label: 'Phone', fieldName: 'Phone', type: 'phone' } ];
export default class ContactList extends LightningElement {
  @api recordId; columns = COLUMNS; contacts; error;
  @wire(getContacts, { accountId: '$recordId' })
  wiredContacts({ data, error }) {
    if (data) { this.contacts = data; this.error = undefined; }
    else if (error) { this.error = error.body ? error.body.message : 'Unknown error'; this.contacts = undefined; }
  }
  handleRowSelection(event) {
    const rows = event.detail.selectedRows;
    this.dispatchEvent(new CustomEvent('selectionchange', { detail: { count: rows.length, ids: rows.map(r => r.Id) } }));
  }
}
<!-- accountContacts.html -->
<template>
  <lightning-card title="Contacts">
    <p class="slds-p-horizontal_small">Selected: {selectedCount}</p>
    <c-contact-list record-id={recordId} onselectionchange={handleSelection}></c-contact-list>
  </lightning-card>
</template>
// accountContacts.js
import { LightningElement, api } from 'lwc';
export default class AccountContacts extends LightningElement {
  @api recordId; selectedCount = 0;
  handleSelection(event) { this.selectedCount = event.detail.count; }
}`,
    points: [
      { k: "Apex method @AuraEnabled(cacheable=true)", w: 1, any: [/@auraenabled\s*\(\s*cacheable\s*=\s*true\s*\)/] },
      { k: "Security in Apex: with sharing / WITH USER_MODE", w: 0.5, any: [/with user_mode|with security_enforced|with sharing/] },
      { k: "@wire with reactive '$recordId'", w: 1, all: [/@wire\s*\(/, /['"]\$recordid['"]/] },
      { k: "lightning-datatable with key-field and Name/Email/Phone columns", w: 1, all: [/lightning-datatable/, /key-field/, /email/, /phone/] },
      { k: "Row selection dispatches a CustomEvent", w: 1, all: [/rowselection/, /dispatchevent\s*\(\s*new\s+customevent/] },
      { k: "Parent: @api recordId, embeds child and listens with on<event>", w: 1, all: [/<c-[\w-]+/, /\son[a-z]+\s*=\s*\{/, /@api\s+recordid/] },
      { k: "Handles wire errors", w: 0.5, any: [/error/] }
    ] },
  C8: { topic: "Integrations", title: "Inbound REST API with test class",
    q: "Expose an endpoint /accounts/ where GET /accounts/{id} returns the Account with its Contacts (404 if not found) and POST creates an Account from name and phone and returns its Id. Write the class and a test class covering GET and POST.",
    model: String.raw`@RestResource(urlMapping='/accounts/*')
global with sharing class AccountRestService {
    @HttpGet
    global static Account getAccount() {
        String accountId = RestContext.request.requestURI.substringAfterLast('/');
        List<Account> accounts = [SELECT Id, Name, Phone, (SELECT Id, Name, Email FROM Contacts)
                                  FROM Account WHERE Id = :accountId WITH USER_MODE LIMIT 1];
        if (accounts.isEmpty()) { RestContext.response.statusCode = 404; return null; }
        return accounts[0];
    }
    @HttpPost
    global static Id createAccount(String name, String phone) {
        Account acc = new Account(Name = name, Phone = phone);
        insert as user acc;
        return acc.Id;
    }
}
@IsTest
private class AccountRestServiceTest {
    @TestSetup static void setup() {
        Account acc = new Account(Name = 'Acme'); insert acc;
        insert new Contact(LastName = 'Rao', AccountId = acc.Id);
    }
    @IsTest static void getReturnsAccountWithContacts() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/accounts/' + acc.Id; req.httpMethod = 'GET';
        RestContext.request = req; RestContext.response = new RestResponse();
        Test.startTest(); Account result = AccountRestService.getAccount(); Test.stopTest();
        Assert.areEqual('Acme', result.Name); Assert.areEqual(1, result.Contacts.size());
    }
    @IsTest static void postCreatesAccount() {
        Test.startTest(); Id newId = AccountRestService.createAccount('Globex', '9999999999'); Test.stopTest();
        Assert.areEqual('Globex', [SELECT Name FROM Account WHERE Id = :newId].Name);
    }
}`,
    points: [
      { k: "@RestResource with /accounts/* mapping", w: 1, all: [/@restresource/, /accounts/] },
      { k: "global class", w: 0.5, any: [/global\s+(with sharing\s+|without sharing\s+|inherited sharing\s+)?class/] },
      { k: "@HttpGet reads Id from RestContext and returns Contacts subquery", w: 1, all: [/@httpget/, /restcontext\.request/, /from\s+contacts/] },
      { k: "Returns 404 when not found", w: 0.5, any: [/404/] },
      { k: "@HttpPost creates the Account and returns its Id", w: 1, all: [/@httppost/, /insert/] },
      { k: "Security: with sharing / USER_MODE / insert as user", w: 0.5, any: [/with sharing|user_mode|as user/] },
      { k: "Test class builds RestRequest/RestContext", w: 1, all: [/@istest/, /restrequest|restcontext\.request\s*=/] },
      { k: "Test asserts results", w: 0.5, any: [/assert/] }
    ] },
  R1: { topic: "Triggers", title: "Trigger with handler – open pipeline roll-up (remix of C1)", remix: "C1",
    q: "Account has a currency field Total_Open_Pipeline__c that must always equal the sum of Amount of that Account's OPEN Opportunities. Keep it accurate when Opportunities are inserted, updated (Amount changes, Stage changes to Closed Won/Lost, or the Opportunity moves to another Account), deleted and undeleted. Use a trigger plus a handler class, with no SOQL or DML in loops. Write one test method that inserts 200 Opportunities.",
    model: String.raw`trigger OpportunityTrigger on Opportunity (after insert, after update, after delete, after undelete) {
    OpportunityRollupHandler.recalculate(Trigger.new, Trigger.oldMap);
}
public with sharing class OpportunityRollupHandler {
    public static void recalculate(List<Opportunity> newList, Map<Id, Opportunity> oldMap) {
        Set<Id> accountIds = new Set<Id>();
        if (newList != null) for (Opportunity o : newList) if (o.AccountId != null) accountIds.add(o.AccountId);
        if (oldMap != null) for (Opportunity o : oldMap.values()) if (o.AccountId != null) accountIds.add(o.AccountId);
        if (accountIds.isEmpty()) return;
        Map<Id, Decimal> totals = new Map<Id, Decimal>();
        for (Id accId : accountIds) totals.put(accId, 0);
        for (AggregateResult ar : [SELECT AccountId accId, SUM(Amount) total FROM Opportunity
                                   WHERE AccountId IN :accountIds AND IsClosed = false GROUP BY AccountId]) {
            Decimal t = (Decimal) ar.get('total');
            totals.put((Id) ar.get('accId'), t == null ? 0 : t);
        }
        List<Account> toUpdate = new List<Account>();
        for (Id accId : totals.keySet()) toUpdate.add(new Account(Id = accId, Total_Open_Pipeline__c = totals.get(accId)));
        update toUpdate;
    }
}
@IsTest
private class OpportunityRollupHandlerTest {
    @IsTest static void rollsUpOpenPipelineInBulk() {
        Account acc = new Account(Name = 'Acme'); insert acc;
        List<Opportunity> opps = new List<Opportunity>();
        for (Integer i = 0; i < 200; i++) opps.add(new Opportunity(Name = 'Opp ' + i, AccountId = acc.Id,
            StageName = 'Prospecting', CloseDate = Date.today().addDays(30), Amount = 100));
        Test.startTest();
        insert opps;
        opps[0].StageName = 'Closed Lost'; update opps[0];
        Test.stopTest();
        Assert.areEqual(19900, [SELECT Total_Open_Pipeline__c FROM Account WHERE Id = :acc.Id].Total_Open_Pipeline__c);
    }
}`,
    points: [
      { k: "Trigger on Opportunity covering after insert/update/delete/undelete", w: 1, all: [/trigger\s+\w+\s+on\s+opportunity/, /after\s+delete/, /after\s+undelete/] },
      { k: "Separate handler class called from trigger", w: 0.5, any: [/class\s+\w*(handler|service|helper)/, /\w+\.\w+\s*\(\s*trigger\./] },
      { k: "Uses old values (Trigger.old/oldMap) for reparent and delete", w: 0.5, any: [/trigger\.old|oldmap/] },
      { k: "SUM(Amount) of open Opportunities only (IsClosed = false)", w: 1, all: [/sum\s*\(\s*amount\s*\)/, /isclosed\s*=\s*false/] },
      { k: "Bulkified: Set<Id> + single update outside loop", w: 1, all: [/set\s*<\s*id\s*>/, /update\s+\w+\s*;|database\.update/] },
      { k: "Best practice: zero for Accounts with no open opps / null checks / with sharing", w: 1, any: [/with sharing|isempty\s*\(\)|!=\s*null|==\s*null/] },
      { k: "Test method inserting 200 Opportunities", w: 1, all: [/@istest|testmethod/, /200/] }
    ] },
  R2: { topic: "Batch + Schedulable", title: "Batch + Schedulable – escalate stale Cases (remix of C2/C3)", remix: "C2+C3",
    q: "Every Case with Status = 'New' that was created more than 7 days ago must be set to Status 'Escalated' and Priority 'High'. (a) Write a Batch class that does this, keeps a count of Cases escalated across all chunks, and emails the count to the running user when finished. (b) Write a Schedulable class that runs it, and the anonymous Apex line that schedules it at 6:30 AM every Monday to Friday.",
    model: String.raw`public class EscalateStaleCasesBatch implements Database.Batchable<SObject>, Database.Stateful {
    private Integer escalated = 0;
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Status, Priority FROM Case
                                         WHERE Status = 'New' AND CreatedDate < LAST_N_DAYS:7]);
    }
    public void execute(Database.BatchableContext bc, List<Case> scope) {
        for (Case c : scope) { c.Status = 'Escalated'; c.Priority = 'High'; }
        for (Database.SaveResult sr : Database.update(scope, false)) if (sr.isSuccess()) escalated++;
    }
    public void finish(Database.BatchableContext bc) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>{ UserInfo.getUserEmail() });
        mail.setSubject('Stale Case escalation complete');
        mail.setPlainTextBody('Cases escalated: ' + escalated);
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
    }
}
public class EscalateStaleCasesScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new EscalateStaleCasesBatch(), 200);
    }
}
// Schedule (anonymous Apex): seconds minutes hours day-of-month month day-of-week
System.schedule('Escalate stale cases - weekdays 6:30 AM', '0 30 6 ? * MON-FRI', new EscalateStaleCasesScheduler());`,
    points: [
      { k: "Implements Database.Batchable", w: 1, any: [/database\.batchable/] },
      { k: "QueryLocator: Status = 'New' and older than 7 days", w: 0.5, all: [/status\s*=\s*'new'/, /createddate/] },
      { k: "Sets Status 'Escalated' and Priority 'High'", w: 0.5, all: [/'escalated'/, /'high'/] },
      { k: "Database.Stateful with running counter", w: 1, all: [/database\.stateful/, /\+\+|\+=/] },
      { k: "finish() emails the count", w: 0.5, all: [/finish/, /singleemailmessage|sendemail/] },
      { k: "Schedulable class calling Database.executeBatch", w: 1, all: [/schedulable/, /database\.executebatch/] },
      { k: "System.schedule with '0 30 6 ? * MON-FRI'", w: 1, all: [/system\.schedule\s*\(/, /0\s+30\s+6\s+\?\s+\*\s+mon-fri/] },
      { k: "Partial-success DML (Database.update(scope,false))", w: 0.5, any: [/database\.update\s*\(|saveresult/] }
    ] }
};

/* ---------------- Section D: scenarios (4 marks each) */
const SCENARIO_BANK = {
  D1: { topic: "Security", q: "Sales Reps must see only their own Opportunities. Sales Managers must see their team's. The Support team, in a separate branch of the role hierarchy, needs Read access to every Opportunity over ₹10 lakh. How do you configure this?",
    model: "Set Opportunity OWD to Private so reps see only their own. Build the role hierarchy so each manager sits above their reps; managers then see their team's records automatically. Add a criteria-based sharing rule: Amount > 10,00,000 shared Read Only with the Support role (and subordinates if needed).",
    points: [
      { k: "Opportunity OWD = Private", w: 1, all: [/owd|org-?wide|organi[sz]ation-?wide/, /private/] },
      { k: "Role hierarchy: managers above reps", w: 1, any: [/role hierarch|hierarchy/] },
      { k: "Criteria-based sharing rule", w: 1, any: [/criteria|sharing rule/] },
      { k: "Amount > 10 lakh shared Read Only with Support", w: 1, all: [/amount|10\s*lakh|10,00,000|1000000|1,000,000/, /read|support/] }
    ] },
  D2: { topic: "Security", q: "A user can open a Case but clicking Edit gives \"insufficient privileges\". Another user with the same profile can edit it. List what you would check, in order.",
    model: "In order: Is the user the owner, or above the owner in the role hierarchy? Does a sharing rule, team or manual share give them Read/Write or only Read? Is the record locked by an approval process? Does a permission set on the other user add Edit or Modify All? Use the Sharing button (or Sharing Hierarchy) to compare both users.",
    points: [
      { k: "Ownership / role hierarchy position", w: 1, any: [/owner|role hierarch|hierarchy/] },
      { k: "Sharing rule / team / manual share – Read vs Read/Write", w: 1, any: [/sharing rule|manual shar|case team|team|read\/write|read only|share/] },
      { k: "Record locked by approval process", w: 1, any: [/lock|approval/] },
      { k: "Permission set (Edit / Modify All) or Sharing button comparison", w: 1, any: [/permission set|modify all|edit permission|sharing (button|hierarchy)/] }
    ] },
  D3: { topic: "Async Apex", q: "A Batch job over 2 million records fails with \"Too many SOQL queries: 201\" inside execute(). The scope size is 200. What is the likely cause, and how do you fix it?",
    model: "A query sits inside a loop in execute(), e.g. one SOQL per record, so 200 records gives 200+ queries. Fix by collecting Ids into a Set, running one query before the loop, and reading results from a Map. Reducing scope size only hides the bug.",
    points: [
      { k: "Cause: SOQL inside a loop (one query per record)", w: 1.5, any: [/(soql|query|queries|select)[\s\S]{0,60}loop|loop[\s\S]{0,60}(soql|query|queries)|per record|each record/] },
      { k: "Fix: collect Ids in a Set, one query, use a Map", w: 1.5, any: [/set|map|collect|bulkif|single query|one query/] },
      { k: "Reducing scope size only hides the problem", w: 1, any: [/scope|reduc|smaller|hides|mask|not (the )?(real )?fix|doesn'?t fix/] }
    ] },
  D4: { topic: "Apex fundamentals", q: "An Account trigger updates related Contacts, and a Contact trigger updates the parent Account. Records now save twice and sometimes hit limits. Why does this happen, and how do you stop it?",
    model: "Each trigger's DML fires the other, creating a recursion loop. Fix with a trigger handler that runs only when relevant fields actually changed (compare old and new values), plus a static Set<Id> of processed records to skip repeats in the same transaction. A plain static Boolean is weaker because it blocks legitimate records in the next 200-record chunk.",
    points: [
      { k: "Cause: recursion – each trigger's DML fires the other", w: 1.5, any: [/recurs|loop|fire[\s\S]{0,30}(each other|again|other trigger)|re-?trigger|cascad|infinite/] },
      { k: "Run only when relevant fields changed (old vs new)", w: 1, any: [/old|changed|compare/] },
      { k: "Static Set<Id> of processed records", w: 1, any: [/static\s+set|set\s*<\s*id\s*>|static/] },
      { k: "Handler pattern / why a static Boolean is weaker", w: 0.5, any: [/boolean|handler|framework/] }
    ] },
  D5: { topic: "LWC", q: "A user updates a record through an imperative Apex call from an LWC, but the lightning-datatable fed by @wire still shows old values. Why, and what is the fix?",
    model: "@wire results are cached on the client, and imperative DML doesn't refresh that cache. Store the wired result and call refreshApex(this.wiredResult) after the save, or use notifyRecordUpdateAvailable when Lightning Data Service records changed.",
    points: [
      { k: "Cause: @wire result is cached on the client", w: 1.5, any: [/cache/] },
      { k: "Fix: refreshApex after the save", w: 1.5, any: [/refreshapex/] },
      { k: "Store the wired result / notifyRecordUpdateAvailable", w: 1, any: [/wiredresult|wired result|provisioned|notifyrecordupdateavailable|getrecordnotifychange/] }
    ] },
  D6: { topic: "Integrations", q: "The FedEx address integration works in the morning but fails later in the day with HTTP 401. What is the likely cause, and how should the integration be designed to avoid it?",
    model: "The OAuth access token expires (often after an hour or a few hours) and the code reuses a stored or hard-coded token. Use a Named Credential with an External Credential (OAuth client credentials) so Salesforce fetches and refreshes tokens itself, and add one retry on 401 for robustness. Never hard-code tokens in Apex or custom settings.",
    points: [
      { k: "Cause: access token expired / reused stale token", w: 1.5, all: [/expir/, /token/] },
      { k: "Named Credential (+ External Credential) manages tokens", w: 1.5, any: [/named credential/] },
      { k: "Refresh token / retry once on 401", w: 0.5, any: [/retry|refresh/] },
      { k: "Never hard-code or store tokens in code/settings", w: 0.5, any: [/hard-?cod|custom setting|stor/] }
    ] },
  XA4: { topic: "Security", remix: "D2", q: "Two users have the same profile and the same role. When they open the same Contact, User A sees the Phone field but User B does not see it at all. List what you would check, in order, and how you would fix it the recommended way.",
    model: "Since the profile is the same, check what differs: (1) permission sets / permission set groups assigned to User A that grant Read on Contact.Phone (use View Field Accessibility / user's Permission Set Assignments). (2) Page layout – same profile but a different record type can show a different layout without Phone. (3) Lightning record page / Dynamic Forms field visibility rules. Fix: grant Read on Phone through a permission set (or group) assigned to User B rather than editing the profile, then verify with Field Accessibility.",
    points: [
      { k: "Permission set / group on User A grants the field", w: 1.5, any: [/permission set/] },
      { k: "Field-Level Security / Field Accessibility", w: 1, any: [/field[- ]level|\bfls\b|field accessibility/] },
      { k: "Page layout / record type / Dynamic Forms visibility", w: 1, any: [/page layout|layout|record type|dynamic form|lightning (record )?page|visibility rule/] },
      { k: "Fix via permission set, not the profile", w: 0.5, any: [/(assign|grant|give|add)[\s\S]{0,40}permission set|permission set group|instead of (editing |changing )?(the )?profile/] }
    ] },
  XA5: { topic: "Integrations", remix: "D6", q: "A callout to the FedEx address API works in the developer sandbox but fails in production with \"Unauthorized endpoint, please check Setup → Security → Remote site settings\". The code hard-codes the URL and an API key. What went wrong, and how should the integration be designed?",
    model: "The endpoint was authorised in the sandbox (Remote Site Setting created there) but never created/deployed in production, and the URL plus API key are hard-coded. Design: use a Named Credential (with an External Credential for the auth) and call 'callout:FedEx_API/...'; Salesforce then authorises the endpoint and injects credentials. Create/deploy the Named Credential per environment (sandbox vs production URLs and secrets differ) via change set or metadata, so no code change is needed between orgs.",
    points: [
      { k: "Cause: Remote Site Setting / endpoint not set up in production", w: 1.5, any: [/remote site/] },
      { k: "Use a Named Credential (callout:...)", w: 1.5, any: [/named credential/] },
      { k: "Per-environment setup / deployment", w: 0.5, any: [/deploy|change set|production|environment|sandbox/] },
      { k: "No hard-coded URL/key – External Credential handles auth", w: 0.5, any: [/hard-?cod|callout:|external credential|auth/] }
    ] },
  XB4: { topic: "Security", remix: "D1", q: "Service Agents must see only the Cases they own. Team Leads must see their team's Cases. The Finance team, in a separate branch of the role hierarchy, needs Read access to every Case with Priority = High. How do you configure this?",
    model: "Set Case OWD to Private so agents see only their own. Build the role hierarchy so each Team Lead sits above their agents (Grant Access Using Hierarchies is always on for standard objects), giving leads their team's Cases. Add a criteria-based sharing rule on Case: Priority = High shared Read Only with the Finance role (and subordinates if needed).",
    points: [
      { k: "Case OWD = Private", w: 1, all: [/owd|org-?wide|organi[sz]ation-?wide/, /private/] },
      { k: "Role hierarchy: Team Leads above agents", w: 1, any: [/role hierarch|hierarchy/] },
      { k: "Criteria-based sharing rule", w: 1, any: [/criteria|sharing rule/] },
      { k: "Priority = High shared Read Only with Finance", w: 1, all: [/priority|high/, /read|finance/] }
    ] },
  XB5: { topic: "Async Apex", remix: "D3", q: "A Batch class's execute() calls a @future method to send each Account to an ERP system. The job fails with \"Future method cannot be called from a future or batch method\". Why, and how would you redesign it?",
    model: "Salesforce does not allow @future calls from batch (or future) contexts. Redesign: make the callout directly in the batch by implementing Database.AllowsCallouts and keep the scope ≤ 100 (100 callouts per transaction) – ideally send records in bulk per call; or enqueue a Queueable from execute()/finish(), or publish Platform Events that a subscriber processes. Do callouts before DML in each execute().",
    points: [
      { k: "Cause: @future not allowed from batch/async context", w: 1.5, any: [/(cannot|can'?t|not allowed|not permitted|not possible|restrict|(does not|doesn'?t|not) (allow|support|permit))[\s\S]{0,60}(batch|async|future)|(batch|async)[\s\S]{0,40}(cannot|can'?t|not allowed)/] },
      { k: "Callouts in batch with Database.AllowsCallouts", w: 1, any: [/allowscallouts/] },
      { k: "Respect callout limit (scope ≤ 100 / bulk calls)", w: 0.5, any: [/100|scope|limit/] },
      { k: "Alternative: Queueable / Platform Events", w: 1, any: [/queueable|platform event|enqueuejob/] }
    ] }
};

/* ---------------- Papers */
const PAPERS = {
  a: {
    label: "Salesforce Developer Evaluation – Paper A",
    mcq: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29],
    short: ["S1", "S3", "S5", "S7", "S9"],
    coding: ["C1", "C2", "C3", "C5", "C7"],
    scenario: ["D1", "D3", "D5", "XA4", "XA5"]
  },
  b: {
    label: "Salesforce Developer Evaluation – Paper B",
    mcq: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    short: ["S2", "S4", "S6", "S8", "S10"],
    coding: ["C4", "C6", "C8", "R1", "R2"],
    scenario: ["D2", "D4", "D6", "XB4", "XB5"]
  }
};
