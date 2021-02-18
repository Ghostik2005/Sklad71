# coding: utf-8

import sys
import time
import json
import datetime

class MOVEMENTS:

    def __init__(self, parent):
        self.parent = parent

    def _execute(self, sql):
        return self.parent._execute(sql)

    def get_filter_list(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_filter_list ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_filter_list ", "*"*10)
        c_name = kwargs.get('filterName')
        rows = []
        if c_name:
            if c_name == 'n_state':
                sql = f"""select n_value, n_id
from ref_states
order by n_value asc"""
            elif c_name == 'n_paid':
                sql = f"""select n_value, n_id
from ref_paids
order by n_value asc"""
            elif c_name == 'n_supplier':
                sql = f"""select n_name, n_id
from ref_partners
where n_type = (select n_id from ref_partners_types where n_name = 'Поставщик')
order by n_name asc"""
            elif c_name == 'n_recipient':
                sql = f"""select n_name, n_id
from ref_partners
where n_type = (select n_id from ref_partners_types where n_name = 'Получатель')
order by n_name asc"""
            elif c_name == 'n_executor':
                sql = f"""select n_name, n_id
from ref_employees
order by n_name asc"""
            else:
                sql = f"""select distinct {c_name}, null
from journals_movements_headers
order by {c_name} asc"""
            rows = self._execute(sql)
        t1 = time.time() - t
        ret = []
        for c, row in enumerate(rows, 1):
            r = {"id": str(row[1]) or str(c), "value": row[0]}
            ret.append(r)

        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def _set_where_get_data(self, params=None):
        # inserts = []
        inserts = ["jmh.n_supplier = (select n_partner_id from service_home_organization)", ]
        if params:
            # self.parent._print(params)
            n_charge = params.get('n_charge')
            n_number = params.get('n_number')
            n_state = params.get('n_state')
            n_dt_invoice = params.get('n_dt_invoice')
            n_supplier = params.get('n_supplier')
            n_recipient = params.get('n_recipient')
            n_summ = params.get('n_summ')
            n_nds = params.get('n_nds')
            n_pos_numbers = params.get('n_pos_numbers')
            n_executor = params.get('n_executor')
            n_base = params.get('n_base', '')
            n_paid = params.get('n_paid')
            n_dt_change = params.get('n_dt_change')
            search_bar = params.get('search_bar')
            if search_bar:
                r = f"""lower(rec.n_name) like lower('%{search_bar}%')"""
                inserts.append(r)
            if n_number:
                if n_number.startswith('='):
                    r = f"""jmh.n_number = '{n_number.replace('=', '')}'"""
                else:
                    r = f"""jmh.n_number like '{n_number}%'"""
                inserts.append(r)
            if n_state:
                r = f"""jmh.n_state = {int(n_state)}"""
                inserts.append(r)
            if n_dt_invoice:
                start = n_dt_invoice.get('start')
                end = n_dt_invoice.get('end')
                if start and end:
                    r = f"""(jmh.n_dt_invoice >= '{str(start)}' and jmh.n_dt_invoice <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""jmh.n_dt_invoice::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_supplier:
                r = f"""jmh.n_supplier in ({n_supplier})"""
                inserts.append(r)
            if n_recipient:
                r = f"""jmh.n_recipient in ({n_recipient})"""
                inserts.append(r)
            if n_charge:
                if n_charge.startswith('='):
                    r = f"""jmh.n_summ = {float(n_charge.replace('=', '').strip())*100}::int"""
                elif n_charge.startswith('>'):
                    r = f"""jmh.n_summ >= {float(n_charge.replace('>', '').strip())*100}::int"""
                elif n_charge.startswith('<'):
                    r = f"""jmh.n_summ <= {float(n_charge.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jmh.n_summ::text like  '{n_charge.strip()}%'"""
                inserts.append(r)
            if n_summ:
                if n_summ.startswith('='):
                    r = f"""jmh.n_summ = {float(n_summ.replace('=', '').strip())*100}::int"""
                elif n_summ.startswith('>'):
                    r = f"""jmh.n_summ >= {float(n_summ.replace('>', '').strip())*100}::int"""
                elif n_summ.startswith('<'):
                    r = f"""jmh.n_summ <= {float(n_summ.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jmh.n_summ::text like  '{n_summ.strip()}%'"""
                inserts.append(r)
            if n_nds:
                if n_nds.startswith('='):
                    r = f"""jmh.n_nds = {float(n_nds.replace('=', '').strip())*100}::int"""
                elif n_nds.startswith('>'):
                    r = f"""jmh.n_nds >= {float(n_nds.replace('>', '').strip())*100}::int"""
                elif n_nds.startswith('<'):
                    r = f"""jmh.n_nds <= {float(n_nds.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jmh.n_nds::text like  '{n_nds.strip()}%'"""
                inserts.append(r)
            if n_pos_numbers:
                if n_pos_numbers.startswith('='):
                    r = f"""jmh.n_pos_numbers = {float(n_pos_numbers.replace('=', '').strip())}::int"""
                elif n_pos_numbers.startswith('>'):
                    r = f"""jmh.n_pos_numbers >= {float(n_pos_numbers.replace('>', '').strip())}::int"""
                elif n_pos_numbers.startswith('<'):
                    r = f"""jmh.n_pos_numbers <= {float(n_pos_numbers.replace('<', '').strip())}::int"""
                else:
                    r = f"""jmh.n_pos_numbers::text like  '{n_pos_numbers.strip()}%'"""
                inserts.append(r)
            if n_executor:
                r = f"""jmh.n_executor in ({n_executor})"""
                inserts.append(r)
            if n_base:
                r = f"""jmh.n_base like '%{n_base.strip()}%'"""
                inserts.append(r)
            if n_paid:
                r = f"""jmh.n_paid = {int(n_paid)}"""
                inserts.append(r)
            if n_dt_change:
                start = n_dt_change.get('start')
                end = n_dt_change.get('end')
                if start and end:
                    r = f"""(jmh.n_dt_change >= '{str(start)}' and jmh.n_dt_change <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""jmh.n_dt_change::date = '{str(start)}'::date"""
                    inserts.append(r)
        where = 'where '+' and '.join(inserts) if inserts else ''
        return where

    def _set_order_get_data(self, field):
        if field == 'n_supplier':
            field = 's.n_name'
        elif field == 'n_paid':
            field = 'p.n_value'
        elif field == 'n_recipient':
            field = 'rec.n_name'
        elif field == 'n_executor':
            field = 'emp.n_name'
        elif field == 'n_number':
            field = 'jmh.n_number::numeric'
        else:
            field = f'jmh.{field}'
        return field

    def get_data(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_data ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_data ", "*"*10)
        filters = kwargs.get('filters')
        if filters:
            field = filters['sort']['id']
            direction = filters['sort']['dir']
            offset = filters.get('start', 0)
            count = filters.get('count', 17)
        else:
            field = 'n_id'
            direction = 'asc'
        where = self._set_where_get_data(filters.get('filters'))
        order = f"""\norder by {self._set_order_get_data(field)} {direction}, 1 asc\n"""

        limits = f"""limit {count} offset {offset}"""

        sql = """select jmh.n_id, jmh.n_number, jmh.n_state, jmh.n_dt_invoice::date, s.n_name,
rec.n_name, jmh.n_summ, jmh.n_nds, jmh.n_pos_numbers, emp.n_name,
jmh.n_base, p.n_value, jmh.n_dt_change, jmh.ctid,
s.n_id, jmh.n_recipient, jmh.n_charge
from journals_movements_headers jmh
join ref_paids p on (jmh.n_paid = p.n_id)
join ref_partners s on (jmh.n_supplier = s.n_id)
join ref_partners rec on (jmh.n_recipient = rec.n_id)
join ref_employees emp on (jmh.n_executor = emp.n_id)
"""
        sql_count = f"""select count(*) from ({sql+where}) as ccc"""
        sql += where + order + limits
        self.parent._print(sql)
        rows = self._execute(sql) or []
        cou = self._execute(sql_count)
        t1 = time.time() - t
        ret = []
        if cou:
            cou = cou[0][0]
        else:
            cou = 0
        summ_docs = 0
        summ_vats = 0
        summ_pos = 0
        for i, row in enumerate(rows):
            # dt_invoice = datetime.datetime.strptime(row[3], "%Y-%m-%d")
            # row[3] = dt_invoice.strftime("%d-%m-%Y")
            summ_docs += row[6]
            summ_vats += row[7]
            summ_pos += row[8]
            r = {
                "row_num": i,
                "n_id": str(row[0]),
                "n_number": row[1],
                "n_state": row[2],
                "n_dt_invoice": row[3],
                "n_supplier": row[4],
                "n_recipient": row[5],
                "n_summ": row[6],
                "n_nds": row[7],
                "n_pos_numbers": row[8],
                "n_executor": row[9],
                "n_base": row[10],
                "n_paid": row[11],
                "n_dt_change": row[12],
                "n_supplier_id": str(row[14]),
                "n_recipient_id": str(row[15]),
                "n_charge": str(row[16])
            }
            # self.parent._print(r)
            ret.append(r)
        t2 = time.time() - t1 - t
        answer = {"pos": offset, "total_count": cou, "data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
                  "summs": {"n_summ": summ_docs, "n_nds": summ_vats, "n_pos_numbers": summ_pos}
                  }
        return answer

    def _make_sql_upd_header(self, header):
        n_base = header.get('n_base', '')
        n_recipient = header.get('n_recipient')
        n_number = header.get('n_number')
        n_dt_invoice = header.get('n_dt_document')
        n_supplier = header.get('n_supplier')
        n_id = header.get('n_id')
        n_exec = header.get('n_executor')
        n_charge = header.get('charge')
        sql_upd_header = f"""update journals_movements_headers jmh
set (n_recipient, n_number, n_dt_invoice, n_supplier,
	 n_summ, n_nds, n_pos_numbers,
	 n_base, n_executor,
	 n_dt_change, n_charge) =
	({int(n_recipient)}::bigint, '{str(n_number)}', '{n_dt_invoice}'::date, {int(n_supplier)}::bigint,
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_movements_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_movements_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_movements_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	'{n_base}'::text, (select n_id from ref_employees where n_name = '{n_exec}'::text),
	CURRENT_TIMESTAMP, {float(n_charge)}::numeric)
where n_id = {int(n_id)}::bigint
returning n_id
        """
        return sql_upd_header

    def _make_sql_new_header(self, header):
        n_state = header.get('n_state')
        n_base = header.get('n_base', '')
        n_recipient = header.get('n_recipient')
        n_number = header.get('n_number')
        n_dt_invoice = header.get('n_dt_document')
        n_supplier = header.get('n_supplier')
        n_id = header.get('n_id')
        n_exec = header.get('n_executor')
        n_charge = header.get('charge')
        sql_new_header = f"""insert into journals_movements_headers
(n_state, n_number, n_dt_invoice,
 n_summ, n_nds, n_pos_numbers, n_base,
 n_supplier, n_recipient,
 n_executor,
 n_paid,
 n_charge) values
({int(n_state)}, '{str(n_number)}', '{n_dt_invoice}'::date,
 0, 0, 0, '{n_base}'::text,
 {int(n_supplier)}::bigint, {int(n_recipient)}::bigint,
 (select n_id from ref_employees where n_name = '{n_exec}'::text),
 (select n_id from ref_paids where n_value = 'Нет'::text),
 {float(n_charge)}::numeric
)
returning n_id
"""
        self.parent._print(sql_new_header)
        return sql_new_header

    def _make_sql_del_body(self, doc_id):
        sql = f"""update journals_movements_bodies set
n_deleted = true
where n_doc_id = {doc_id}::bigint and not n_deleted"""

        return sql

    def _make_sql_new_body(self, data, doc_id):
        sql = []
        for row in data.get('table'):
            if not row.get('n_code'):
                continue
            self.parent._print(row)
            json_row = {
                "n_product": int(row['n_prod_id']),
                "n_code": row['n_code'],
                "n_unit": "шт.",
                "n_amount": int(row['n_amount']),
                "n_price": int(row['n_price']),
                "n_ship_price": int(row['n_ship_price']),
                "n_vat": float(row['n_vat']),
                "n_novats_summ": int(row['n_novats_summ']),
                "n_charge": float(row['n_charge']) if row['n_charge'] else 0,
                "n_vats_summ": int(row['n_vats_summ']),
                "n_total_summ": int(row['n_total_summ']),
                "n_balance_id": int(row['n_balance_id'])
            }
            json_row = json.dumps(json_row, ensure_ascii=False)
            s = f"""insert into journals_movements_bodies
(n_doc_id, n_product) values
({doc_id}::bigint, ('{json_row}')::jsonb)
"""
            sql.append(s)
        sql = ';\n'.join(sql)
        self.parent._print(sql)
        return sql

    def recalc_movements_body(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " recalc_movements_body ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " recalc_movements_body ", "*"*10)
        doc_id = kwargs.get('doc_id')
        if doc_id:
            sql = f"""update journals_movements_headers jmh
set (n_summ, n_nds, n_pos_numbers,
	 n_dt_change,
     n_charge) = (
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	CURRENT_TIMESTAMP,
    (select round((spr/pr*100)-100, 2) from
		(select n_doc_id, sum((n_product->'n_price')::numeric) as pr
		 from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s51,
		(select n_doc_id, sum((n_product->'n_ship_price')::numeric) as spr
		 from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s50)
    )
where n_id = {int(doc_id)}::bigint
returning n_id
        """
            self.parent._print(sql)

            sql_1 = f"""update journals_movements_headers jmh
set (n_summ,
     n_nds,
     n_pos_numbers,
	 n_dt_change,
     n_charge) =
	(
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_movements_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	CURRENT_TIMESTAMP)
where n_id = {int(doc_id)}::bigint
returning n_id
        """
            res = self._execute(sql)
        # res = [[int(doc_id),],]
        t1 = time.time() - t
        res = self.parent._get_movement_header(doc_id)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def save_movements_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " save_movements_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " save_movements_document ", "*"*10)
        doc_data = kwargs.get('doc_data')
        res = []
        if doc_data:
            header = doc_data.get('header', {})
            n_id = header.get('n_id')
            if n_id:
                doc_id = int(doc_data.get('header').get('n_id'))
                self._execute(self._make_sql_del_body(doc_id))
                r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
                r_head = self._execute(self._make_sql_upd_header(header))
                res = self.parent._get_movement_header(n_id)
            else:
                r_head = self._execute(self._make_sql_new_header(header))
                doc_id = r_head[0][0]
                r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
                r_h_update = self.recalc_movements_body(**{"user": "_service_acount", "doc_id": doc_id})
                res = r_h_update.get('data')

        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def get_movements_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_movements_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_movements_document ", "*"*10)
        doc_id = kwargs.get('doc_id')
        ret = []
        if doc_id:
            sql_old = f"""select jmb.n_id,
j1.name,
jmb.n_product->'n_code',
jmb.n_product->'n_unit',
jmb.n_product->'n_amount' as amount,
jmb.n_product->'n_price',
jmb.n_product->'n_ship_price',
jmb.n_product->'n_vat',
jmb.n_product->'n_novats_summ',
jmb.n_product->'n_charge',
jmb.n_product->'n_vats_summ',
jmb.n_product->'n_total_summ',
jmb.n_product->'n_product',
j1.stock,
jmb.n_product->'n_balance_id',
j1.c_limit_excl
from journals_movements_bodies jmb
join (select pb.n_product_id, rp.c_name as name, pb.n_id  as id, pb.n_quantity as stock, rp.c_limit_excl as c_limit_excl
 		from journals_products_balance pb
 		join ref_products rp on (rp.c_id=pb.n_product_id)) as j1
 	on (j1.id = (jmb.n_product->'n_balance_id')::bigint)
where jmb.n_doc_id = {int(doc_id)} and not n_deleted
order by jmb.n_id
"""
            sql = f"""select jmb.n_id,
j1.name,
jmb.n_product->'n_code' as pr_code,
jmb.n_product->'n_unit',
jmb.n_product->'n_amount' as amount,
jmb.n_product->'n_price', jmb.n_product->'n_ship_price',
jmb.n_product->'n_vat', jmb.n_product->'n_novats_summ',
jmb.n_product->'n_charge', jmb.n_product->'n_vats_summ',
jmb.n_product->'n_total_summ',
jmb.n_product->'n_product' as n_prod,
j1.stock,
jmb.n_product->'n_balance_id'
from journals_movements_bodies jmb
join (select d1.n_product_id as n_product_id, rp.c_name as name, d1.stock as stock
from (select pb.n_product_id as n_product_id, max(pb.n_quantity) as stock
	from journals_products_balance pb
	group by pb.n_product_id) as d1
	join ref_products rp on (rp.c_id=d1.n_product_id)) as j1
 	on (j1.n_product_id = (jmb.n_product->'n_balance_id')::bigint)
where jmb.n_doc_id = {int(doc_id)} and not n_deleted
order by jmb.n_id
            """
            self.parent._print(sql)
            ret = self._execute(sql)
            if not ret:
                ret = self._execute(sql_old)
        t1 = time.time() - t
        res = []
        for i, row in enumerate(ret):
            r = {
                "row_num": i,
                "n_id": str(row[0]),
                "n_product": row[1],
                "n_code": row[2],
                "n_unit": row[3],
                "n_okei_code": "",
                "n_type_package": "",
                "n_amount_mass": "",
                "n_amount_b": "",
                "n_gross_weight": "",
                "n_amount": row[4],
                "n_price": row[5],
                "n_ship_price": row[6],
                "n_vat":  row[7],
                "n_novats_summ": row[8],
                "n_charge":  row[9],
                "n_vats_summ": row[10],
                "n_total_summ": row[11],
                "n_prod_id": str(row[12]),
                "n_stock": row[13],
                "n_balance_id": str(row[14]),
                "c_limit_excl": row[15]
            }
            res.append(r)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def __call__(self):

        return "Movements"


