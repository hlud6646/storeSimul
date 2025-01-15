--
-- Employee Audit
--
-- To try and identify inventory inconsistencies, we now record any modifications.

create or replace trigger inventory_audit
    after update
    on product
    for each row
execute function record_inventory_modification();


create or replace function record_inventory_modification() returns trigger as
$record_inventory_modification$
begin
    insert into inventory_modification
    values (now(),
            OLD.inventory,
            NEW.inventory,
            current_user,
            NEW.id);
    return null;
end;
$record_inventory_modification$
    language plpgsql;