# coding: utf-8

import sys
import time
import json
import datetime

class ARRIVALS:

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
from journals_arrivals_headers
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
        inserts = ["jah.n_recipient = (select n_partner_id from service_home_organization)", ]
        if params:
            self.parent._print(params)
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
            if n_number:
                if n_number.startswith('='):
                    r = f"""jah.n_number = '{n_number.replace('=', '')}'"""
                else:
                    r = f"""jah.n_number like '{n_number}%'"""
                inserts.append(r)
            if n_state:
                r = f"""jah.n_state = {int(n_state)}"""
                inserts.append(r)
            if n_dt_invoice:
                start = n_dt_invoice.get('start')
                end = n_dt_invoice.get('end')
                if start and end:
                    r = f"""(jah.n_dt_invoice >= '{str(start)}' and jah.n_dt_invoice <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""jah.n_dt_invoice::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_supplier:
                r = f"""jah.n_supplier in ({n_supplier})"""
                inserts.append(r)
            if search_bar:
                r = f"""lower(s.n_name) like lower('%{search_bar}%')"""
                inserts.append(r)
            if n_recipient:
                r = f"""jah.n_recipient in ({n_recipient})"""
                inserts.append(r)
            if n_summ:
                if n_summ.startswith('='):
                    r = f"""jah.n_summ = {float(n_summ.replace('=', '').strip())*100}::int"""
                elif n_summ.startswith('>'):
                    r = f"""jah.n_summ >= {float(n_summ.replace('>', '').strip())*100}::int"""
                elif n_summ.startswith('<'):
                    r = f"""jah.n_summ <= {float(n_summ.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jah.n_summ::text like  '{n_summ.strip()}%'"""
                inserts.append(r)
            if n_nds:
                if n_nds.startswith('='):
                    r = f"""jah.n_nds = {float(n_nds.replace('=', '').strip())*100}::int"""
                elif n_nds.startswith('>'):
                    r = f"""jah.n_nds >= {float(n_nds.replace('>', '').strip())*100}::int"""
                elif n_nds.startswith('<'):
                    r = f"""jah.n_nds <= {float(n_nds.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jah.n_nds::text like  '{n_nds.strip()}%'"""
                inserts.append(r)
            if n_pos_numbers:
                if n_pos_numbers.startswith('='):
                    r = f"""jah.n_pos_numbers = {float(n_pos_numbers.replace('=', '').strip())}::int"""
                elif n_pos_numbers.startswith('>'):
                    r = f"""jah.n_pos_numbers >= {float(n_pos_numbers.replace('>', '').strip())}::int"""
                elif n_pos_numbers.startswith('<'):
                    r = f"""jah.n_pos_numbers <= {float(n_pos_numbers.replace('<', '').strip())}::int"""
                else:
                    r = f"""jah.n_pos_numbers::text like  '{n_pos_numbers.strip()}%'"""
                inserts.append(r)
            if n_executor:
                r = f"""jah.n_executor in ({n_executor})"""
                inserts.append(r)
            if n_base:
                r = f"""jah.n_base like '%{n_base.strip()}%'"""
                inserts.append(r)
            if n_paid:
                r = f"""jah.n_paid = {int(n_paid)}"""
                inserts.append(r)
            if n_dt_change:
                start = n_dt_change.get('start')
                end = n_dt_change.get('end')
                if start and end:
                    r = f"""(jah.n_dt_change >= '{str(start)}' and jah.n_dt_change <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""jah.n_dt_change::date = '{str(start)}'::date"""
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
            field = 'jah.n_number::numeric'
        else:
            field = f'jah.{field}'
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

        sql = """select jah.n_id, jah.n_number, jah.n_state, jah.n_dt_invoice::date, s.n_name,
rec.n_name, jah.n_summ, jah.n_nds, jah.n_pos_numbers, emp.n_name,
jah.n_base, p.n_value, jah.n_dt_change, jah.ctid,
s.n_id, jah.n_recipient
from journals_arrivals_headers jah
join ref_paids p on (jah.n_paid = p.n_id)
join ref_partners s on (jah.n_supplier = s.n_id)
join ref_partners rec on (jah.n_recipient = rec.n_id)
join ref_employees emp on (jah.n_executor = emp.n_id)
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
                "n_recipient_id": str(row[15])
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
        sql_upd_header = f"""update journals_arrivals_headers jah
set (n_recipient, n_number, n_dt_invoice, n_supplier,
	 n_summ, n_nds, n_pos_numbers,
	 n_base, n_executor,
	 n_dt_change) =
	({int(n_recipient)}::bigint, '{str(n_number)}', '{n_dt_invoice}'::date, {int(n_supplier)}::bigint,
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_arrivals_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_arrivals_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_arrivals_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	'{n_base}'::text, (select n_id from ref_employees where n_name = '{n_exec}'::text),
	CURRENT_TIMESTAMP)
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
        sql_new_header = f"""insert into journals_arrivals_headers
(n_state, n_number, n_dt_invoice,
 n_summ, n_nds, n_pos_numbers, n_base,
 n_supplier, n_recipient,
 n_executor,
 n_paid) values
({int(n_state)}, '{str(n_number)}', '{n_dt_invoice}'::date,
 0, 0, 0, '{n_base}'::text,
 {int(n_supplier)}::bigint, {int(n_recipient)}::bigint,
 (select n_id from ref_employees where n_name = '{n_exec}'::text),
 (select n_id from ref_paids where n_value = 'Нет'::text)
)
returning n_id
"""
        self.parent._print(sql_new_header)
        return sql_new_header

    def _make_sql_del_body(self, doc_id):
        sql = f"""update journals_arrivals_bodies set
n_deleted = true
where n_doc_id = {doc_id}::bigint and not n_deleted"""

        return sql

    def _make_sql_new_body(self, data, doc_id):
        sql = []
        for row in data.get('table'):
            if not row.get('n_code'):
                continue
            # self.parent._print(row)
            json_row = {
                "n_product": int(row['n_prod_id']),
                "n_code": row['n_code'],
                "n_unit": "шт.",
                "n_amount": int(row['n_amount']),
                "n_price": int(row['n_price']),
                "n_novats_summ": int(row['n_novats_summ']),
                "n_vats_base": int(row.get('n_vats_base', '0').replace('НДС ', '').replace('%', '')),
                "n_vats_summ": int(row['n_vats_summ']),
                "n_total_summ": int(row['n_total_summ']),
                "n_consignment": row["n_consignment"]
            }
            json_row = json.dumps(json_row, ensure_ascii=False)
            s = f"""insert into journals_arrivals_bodies
(n_doc_id, n_product) values
({doc_id}::bigint, ('{json_row}')::jsonb)
"""
            sql.append(s)
        sql = ';\n'.join(sql)
        return sql

    def recalc_arrivals_body(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " recalc_arrivals_body ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " recalc_arrivals_body ", "*"*10)
        doc_id = kwargs.get('doc_id')
        if doc_id:
            sql = f"""update journals_arrivals_headers jah
set (n_summ,
     n_nds,
     n_pos_numbers,
	 n_dt_change) =
	(
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_arrivals_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_arrivals_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_arrivals_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	CURRENT_TIMESTAMP)
where n_id = {int(doc_id)}::bigint
returning n_id
        """
            res = self._execute(sql)
        t1 = time.time() - t
        res = self.parent._get_arrival_header(doc_id)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def save_arrivals_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " save_arrivals_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " save_arrivals_document ", "*"*10)
        doc_data = kwargs.get('doc_data')
        res = []
        if doc_data:
            header = doc_data.get('header', {})
            n_id = header.get('n_id')
            if n_id:
                doc_id = int(doc_data.get('header').get('n_id'))
                r_body = self._execute(self._make_sql_del_body(doc_id))
                r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
                r_head = self._execute(self._make_sql_upd_header(header))
                res = self.parent._get_arrival_header(n_id)
            else:
                r_head = self._execute(self._make_sql_new_header(header))
                doc_id = r_head[0][0]
                r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
                r_h_update = self.recalc_arrivals_body(**{"user": "_service_acount", "doc_id": doc_id})
                res = r_h_update.get('data')

        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def get_arrivals_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_arrivals_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_arrivals_document ", "*"*10)
        doc_id = kwargs.get('doc_id')
        ret = []
        if doc_id:
            sql = f"""select n_id,
rp.c_name,
jab.n_product->'n_code',
jab.n_product->'n_unit',
jab.n_product->'n_amount',
jab.n_product->'n_price',
jab.n_product->'n_novats_summ',
rv.c_name,
jab.n_product->'n_vats_summ',
jab.n_product->'n_total_summ',
rp.c_id,
jab.n_product->'n_consignment'

from journals_arrivals_bodies jab
join ref_products rp on (rp.c_id=(jab.n_product->'n_product')::bigint)
join ref_vats rv on (rv.c_vat=(jab.n_product->'n_vats_base')::int)
where jab.n_doc_id = {int(doc_id)}
and not n_deleted
order by jab.n_id
            """
            ret = self._execute(sql)
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
                "n_novats_summ": row[6],
                "n_vats_base": row[7],
                "n_vats_summ": row[8],
                "n_total_summ": row[9],
                "n_prod_id": str(row[10]),
                "n_consignment": row[11]
            }
            res.append(r)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def __call__(self):

        return "Arrivals"


"""
--вставка случайных данных
insert into journals_arrivals_headers
(n_state, n_number, n_dt_invoice,
 n_summ, n_nds, n_pos_numbers, n_base,
 n_supplier, n_recipient, n_executor, n_paid)
SELECT
r_state, r_num, r_date::timestamp,
r_sum, r_sum/5, r_pos, 'основание '||r_num,
r_sup, r_rec, r_emp, r_paid
FROM generate_series(1,3) as l   -- number of times
CROSS JOIN LATERAL (select l.l * 0 + n_id as r_emp from ref_employees order by random() limit 1) AS t1
CROSS JOIN LATERAL (select l.l * 0 + n_id as r_paid from ref_paids order by random() limit 1) as t2
CROSS JOIN LATERAL (select l.l * 0 + n_id as r_rec from ref_recipients order by random() limit 1) as t3
CROSS JOIN LATERAL (select l.l * 0 + n_id as r_state from ref_states order by random() limit 1) as t4
CROSS JOIN LATERAL (select l.l * 0 + n_id as r_sup from ref_suppliers order by random() limit 1) as t5
CROSS JOIN LATERAL
    (select to_timestamp(l.l * 0 +
			 EXTRACT(EPOCH FROM TIMESTAMP '2020-01-10 10:38:40')+(random()*7776000)::integer) as r_date limit 1
	) as t6
CROSS JOIN LATERAL ( select (l.l*0 + 1500 + (random()*1000)::integer)::text as r_num) as t7
CROSS JOIN LATERAL ( select (l.l*0 + 1500 + (random()*1000)::integer)*100 as r_sum) as t8
CROSS JOIN LATERAL ( select (l.l*0 + 3 + (random()*100)::integer) as r_pos) as t9
"""