# hacBMSTU

## api doc

at // basic GET PUSH POST DELETE req-s, should be avaluable for admin only
at /getweek GET PUSH POST req-s for users, already combines to complete sql comands

/auth request returns token required for any other action.

### auth structure: https://scv.forshielders.ru /auth? username=user &password=password

### request structure: https://scv.forshielders.ru /getweek? &start=mm-ddhh-mm &end=mm-ddhh-mm & token=token

Returns array of JSONs
JSONs fields: 
    name: string, //name of subject
    descriotion: string,
    id: int, 
    daytime: mm-ddhh-mm,
    author: course num + group num + student num

### create ur event https://scv.forshielders.ru /createevent ?token=token





to build successfully u should create config js with const password




ПЕРЕПИСАТЬ МОДЕЛЬ С return А НЕ С OBJ.request, ЭТО ЖЕ КРИНЖ!!!